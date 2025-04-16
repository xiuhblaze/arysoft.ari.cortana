const consoleLog = (...args) => {
    
    if (process.env.NODE_ENV === 'development') {
        console.log(...args);
        //console.trace();
        // //console.log(...args);
        // const stack = new Error().stack.split("\n")[2]; // Captura la línea de la llamada
        // const info = stack.match(/\((.*):(\d+):(\d+)\)/); // Extrae archivo, línea y columna
        // console.log('info', info);

        // if (info) {
        //     console.log(`[consoleLog] ${info[1]}:${info[2]} →`, ...args);
        // } else {
            //  console.log(`[consoleLog] →`, ...args);
            //  console.trace();
        // }
        
    // try {
    //     throw new Error();
    // } catch (err) {
    //     //console.log(err.stack);
    //     const stack = err.stack.split("\n")[1]; 
    //     //console.log('stack', stack);
    //     const filename = stack.split("/").pop();
    //     console.log('filename', filename);
    //     const preinfo = stack.split(":");
    //     //console.log('preinfo', preinfo);
    //     const info = stack.match(/\((.*):(\d+):(\d+)\)/);
    //     //console.log('info', info);

    //     if (!!filename) {
    //         console.log(`[DEV LOG] ${filename} →`, ...args);
    //     } else {
    //         console.log(`[DEV LOG] →`, ...args);
    //     }
    // }
    }
};

export default consoleLog;