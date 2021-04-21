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
[1,	1.94],
[2,	1.985],
[3,	2.022],
[4,	2.055],
[5,	2.076],
[6,	2.092],
[7,	2.114],
[8,	2.13],
[9,	2.144],
[10,2.155],
[20,2.234],
[30,2.271],
[40,2.307],
[50,2.321],
[60,2.356],
[70,2.37],
[80,2.385],
[90,2.398],
[100,2.41]
];

// X - power
// Y - voltage
const tmV02 = [
//    [0.0001, 0.425],
[1,	1.94],
[2,	1.98],
[3,	2.02],
[4,	2.056],
[5,	2.075],
[6,	2.092],
[7,	2.114],
[8,	2.130],
[9,	2.143],
[10,2.154],
[20,2.232],
[30,2.265],
[40,2.298],
[50,2.313],
[60,2.348],
[70,2.363],
[80,2.377],
[90,2.39],
[100,2.404]
];



// X - power
// Y - voltage
const tmV03 = [
//    [0.0001,    0.594],
    [1,	        1.940],
    [10,	    2.155],
    [100,	    2.410]
];

const tm50ohm54dbFwd =[
//    [0.0001, 594],
[1,	1940],
[2,	1985],
[3,	2022],
[4,	2055],
[5,	2076],
[6,	2092],
[7,	2114],
[8,	2130],
[9,	2144],
[10,2155],
[20,2234],
[30,2271],
[40,2307],
[50,2321],
[60,2356],
[70,2370],
[80,2385],
[90,2398],
[100,2410]
];

const tm50ohm54dbRfl =[
//    [0.0001, 425],
[1,	1940],
[2,	1980],
[3,	2020],
[4,	2056],
[5,	2075],
[6,	2092],
[7,	2114],
[8,	2130],
[9,	2143],
[10,2154],
[20,2232],
[30,2265],
[40,2298],
[50,2313],
[60,2348],
[70,2363],
[80,2377],
[90,2390],
[100,2404]
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
