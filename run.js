const { CabalBot } = require('./src/index.js');

const botQuotes = {
    WHOPPER: "how about a nice game of chess?", //WHOPPER
    DARYL: "Doctor, What am I?", //DARYL
    Max_Headroom: "Say, would someone mind checking the ratings? I seem to have an audience of two.",
    HAL_9000: "Affirmative, Dave. I read you.",
    Marvin: "I think you ought to know I'm feeling very depressed",
    Demerezel: "I know hope is painful.",
    Robot: "Danger!"
};

(async ()=>{
    try{
        const pick = Object.keys(botQuotes)[Math.floor(Math.random() * Object.keys(botQuotes).length)];
        const bot = new CabalBot(
            process.env.CABAL_INSTANCE_URL
        );
        bot.handle = pick.replace(/_/g, ' ');
        const channel = await bot.join('default');
        console.log(`${bot.handle}: ${botQuotes[pick]}`);
        await channel.output(botQuotes[pick]);
    }catch(ex){
        console.error(ex);
    }
})();