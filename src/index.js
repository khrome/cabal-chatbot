const Client = require('cabal-client');
//TODO: support custom client options
const instance = (opts = { config: { dbdir: '/tmp/cabals' } })=>{
    const client = new Client(opts);
    class CabalBot{
        constructor(opts={}){
            this.options = (typeof opts === 'string'?{
                instance: opts
            }:opts);
            if(this.options.handle){
                this.handle = this.options.handle;
            }
            this.client = client;
            //TODO: support meta bots (multi-instance)
        }
        
        async connect(inst){
            const instance = inst || this.options.instance;
            if(instance){
                this.connection = await this.client.addCabal(instance);
            }else{
                this.connection = await this.client.createCabal();
            }
            if(this.handle){
                await new Promise((resolve, reject)=>{
                    this.connection.publishNick(this.handle, (err) => {
                        if(err) return reject(err);
                        resolve();
                    });
                });
            }
            return this.connection;
        }
        
        async disconnect(){
            return await client.close();
        }
        
        async join(channelName='default'){
            if(!this.connection){
                await this.connect();
            }
            this.connection.joinChannel(channelName);
            const channel = {
                output: async (text)=>{
                    new Promise((resolve, reject)=>{
                        this.connection.publishMessage({
                            type: 'chat/text',
                            content: {
                                text,
                                channel: channelName
                            }
                        }, (err) => {
                            if(err) return reject(err);
                            resolve();
                        });
                    });
                },
                monitor: (handler)=>{
                    const initTime = new Date().getTime();
                    this.connection.on('new-message', (
                        envelope
                    )=>{
                        if(envelope.message.value.content.channel === channelName){
                            handler(
                                envelope, 
                                this.connection, 
                                initTime
                            );
                        }
                    });
                },
                command: (definition, handler)=>{
                    return channel.monitor((envelope, cabal, initTime)=>{
                        const incomingText = envelope.message.value.content.text;
                        const matchResults = incomingText.match(definition);
                        if(matchResults && matchResults.groups){
                            handler(envelope.author, matchResults.groups);
                        }
                    });
                }
            };
            return channel;
        }
    }
    return {CabalBot};
};

const { CabalBot } = instance();

module.exports = {
    instance,
    CabalBot
};