cabal-chatbot
===============

A Foundation for building bots in cabal instances and channels, with a test framework. 

(In commonjs until there is a browser solution for cabal)

Usage
-----

```js
    const bot = new CabalBot(<url>);
    bot.handle = '<nick>';
    const channel = await bot.join('<channel_name>');
    await channel.output('A message I want to send');
```

demo
----

 A demo (hardwired to `cabal://5c6f9a33961f91fbc48e5cba5fccaf017ba7f0aee22a667082057d14c9e07f1c`, which I created for this purpose) it will randomly select a name/message pair and dump them in the `default` channel of that instance.

Testing
-------

`npm run test`