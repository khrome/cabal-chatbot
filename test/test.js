/* global describe:false, it:false, before:false, after:false */
const should = require('chai').should();
const { CabalBot } = require('../src/index.js');
const CoreBot = require('../src/index.js').instance({
    config: { dbdir: '/tmp/core-cabals' } 
}).CabalBot;

let url;
let instanceBot;

const premise = ()=>{
    setTimeout(()=>{
        console.log(`      @ ${url}`);
    });
};

describe('cabal-chatbot', ()=>{
    describe('can create a new ', ()=>{
        before('creates a new cabal instance for the tests', async function(){
            should.exist(CoreBot);
            instanceBot = new CoreBot();
            await instanceBot.connect();
            url = `cabal://${instanceBot.connection.key}`;
            premise();
        });
        
        it('can send and recieve messages in the default channel', async function(){
            should.exist(CabalBot);
            this.timeout(30000);
            const chatMessage = 'just a test';
            const bot = new CabalBot(instanceBot.connection.key);
            const instanceChannel = await instanceBot.join('default');
            const channel = await bot.join('default');
            const future = new Promise((resolve, reject)=>{
                channel.monitor((envelope)=>{
                    resolve(envelope.message.value.content.text);
                });
            });
            await instanceChannel.output(chatMessage);
            (await future).should.equal(chatMessage);
        });
        
        after('closes the cabal instance', async function(){
            setTimeout(()=>{
                //todo: properly dispose of resources to prevent hang
                process.exit();
            }, 500);
        });
    });
});