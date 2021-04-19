const { Factory } = require('winston-simple-wrapper')
const log = new Factory({
  transports: [{
      type: 'console',
      level: 'silly'
    }, {
      type: 'file',
      level: 'debug',
      filename: 'logs/gateway.log'
  }]
})
const regression = require('regression');


// X - power
// Y - voltage
const tmV01 = [
//    [0.0001, 0.594],
[1,	1.85],
[2,	1.906],
[3,	1.935],
[4,	1.966],
[5,	1.988],
[6,	2.003],
[7,	2.022],
[8,	2.04],
[9,	2.05],
[10,2.06],
[20,2.144],
[30,2.176],
[40,2.216],
[50,2.238],
[60,2.275],
[70,2.292],
[80,2.304],
[90,2.316],
[100,2.328]
];

// X - power
// Y - voltage
const tmV02 = [
//    [0.0001, 0.425],
[1,	1.86],
[2,	1.914],
[3,	1.946],
[4,	1.975],
[5,	1.998],
[6,	2.01],
[7,	2.034],
[8,	2.048],
[9,	2.06],
[10,2.07],
[20,2.15],
[30,2.188],
[40,2.226],
[50,2.242],
[60,2.28],
[70,2.3],
[80,2.311],
[90,2.322],
[100,2.332]
];



// X - power
// Y - voltage
const tmV03 = [
//    [0.0001,    0.594],
    [1,	        1.85],
    [10,	    2.06],
    [100,	    2.328]
];

const tm50ohm54dbFwd =[
//    [0.0001, 594],
[1,	1850],
[2,	1906],
[3,	1935],
[4,	1966],
[5,	1988],
[6,	2003],
[7,	2022],
[8,	2040],
[9,	2050],
[10,2060],
[20,2144],
[30,2176],
[40,2216],
[50,2238],
[60,2275],
[70,2292],
[80,2304],
[90,2316],
[100,2328]
];

const tm50ohm54dbRfl =[
//    [0.0001, 425],
[1,	1860],
[2,	1914],
[3,	1946],
[4,	1975],
[5,	1998],
[6,	2010],
[7,	2034],
[8,	2048],
[9,	2060],
[10,2070],
[20,2150],
[30,2188],
[40,2226],
[50,2242],
[60,2280],
[70,2300],
[80,2311],
[90,2322],
[100,2332]
];

function runExperiment(name, data) {
    log.info("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~", name);
    let result = regression.logarithmic(data, {precision: 6});
    log.info("R^2:                 " + result.r2, name);    
    log.info("Voltage at 1kW:      " + result.predict(1000)[1], name);    
    log.info("Voltage at 0.9kW:    " + result.predict(900)[1], name);  
    log.info("Voltage at 100W:     " + result.predict(100)[1], name); 
    log.info("Voltage at 10W:      " + result.predict(10)[1], name);   
    log.info("Voltage at 1W:       " + result.predict(1)[1], name);    
    log.info("Voltage at 0.1W:     " + result.predict(0.1)[1], name);    
    log.info("Voltage at 0.001W:   " + result.predict(0.001)[1], name);    
    log.info("Voltage at 0.0001W:  " + result.predict(0.0001)[1], name);    
    //log.info("Slope:               " + Math.round((result.predict(11.22018)[1] - result.predict(10)[1])*100000) / 100 + " mV/dB", name);    
    log.info("Slope:               " + Math.round((result.equation[1] / Math.LOG10E) * 100000 / 20)/100 + " mV/dB", name);    
    log.info("Intercept:           " + Math.round((result.equation[0] * Math.LOG10E)*1000)/1000 + " V", name);    
    log.info("Function dir:        " + JSON.stringify(result.string), name);    
    log.info(`Function inv:        "y = exp((x - ${result.equation[0]})/${result.equation[1]})"`, name);    
    log.info("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n\n", name);    
}

runExperiment("V1", tmV01);
runExperiment("V2", tmV02);
runExperiment("V3", tmV03);
runExperiment("50 Ohm -54.54dB: Fwd", tm50ohm54dbFwd);
runExperiment("50 Ohm -54.54dB: Rfl", tm50ohm54dbRfl);
log.info("Visualizer url: https://www.desmos.com/calculator/");
log.info("done.\n\n");    
