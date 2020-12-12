export default {
    aliases: ['exit', 'e'],
    usage: '',
    description: 'close the terminal',
    execute: async () => {
        console.log('goodbye');
        process.exit();
    },
};
