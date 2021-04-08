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
//    [0.0001, 0.622],
    [1,	1.485],
    [2,	1.538],
    [3,	1.57],
    [4,	1.6],
    [5,	1.62],
    [6,	1.632],
    [7,	1.65],
    [8,	1.665],
    [9,	1.674],
    [10,	1.683],
    [20,	1.753],
    [30,	1.78],
    [40,	1.8],
    [50,	1.845],
    [60,	1.865],
    [70,	1.875],
    [80,	1.885],
    [90,	1.895],
    [100,	1.9]
];

// X - power
// Y - voltage
const tmV02 = [
//    [0.0001, 0.425],
    [1,	1.046],
    [2,	1.095],
    [3,	1.127],
    [4,	1.160],
    [5,	1.180],
    [6,	1.194],
    [7,	1.212],
    [8,	1.228],
    [9,	1.235],
    [10,	1.244],
    [20,	1.308],
    [30,	1.320],
    [40,	1.335],
    [50,	1.370],
    [60,	1.375],
    [70,	1.379],
    [80,	1.382],
    [90,	1.385],
    [100,	1.390]
];



// X - power
// Y - voltage
const tmV03 = [
    [0.0001,    0.622],
    [1,	        1.485],
    [10,	    1.683],
    [100,	    1.9]
];

const tm50ohm54dbFwd =[
    [0.0001, 622],
    [1,	1485],
    [2,	1538],
    [3,	1570],
    [4,	1600],
    [5,	1620],
    [6,	1632],
    [7,	1650],
    [8,	1665],
    [9,	1674],
    [10,	1683],
    [20,	1753],
    [30,	1780],
    [40,	1800],
    [50,	1845],
    [60,	1865],
    [70,	1875],
    [80,	1885],
    [90,	1895],
    [100,	1900]
];

const tm50ohm54dbRfl =[
    [0.0001, 290],
    [1,	1046],
    [2,	1095],
    [3,	1127],
    [4,	1160],
    [5,	1180],
    [6,	1194],
    [7,	1212],
    [8,	1228],
    [9,	1235],
    [10,	1244],
    [20,	1308],
    [30,	1320],
    [40,	1335],
    [50,	1370],
    [60,	1375],
    [70,	1379],
    [80,	1382],
    [90,	1385],
    [100,	1390]
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
