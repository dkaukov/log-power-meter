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
    [1,	1.465],
    [2,	1.516],
    [3,	1.548],
    [4,	1.575],
    [5,	1.595],
    [6,	1.608],
    [7,	1.626],
    [8,	1.64],
    [9,	1.65],
    [10,	1.66],
    [20,	1.73],
    [30,	1.775],
    [40,	1.8],
    [50,	1.82],
    [60,	1.843],
    [70,	1.85],
    [80,	1.863],
    [90,	1.87],
    [100,	1.878]];

// X - power
// Y - voltage
const tmV02 = [
    [1,	1.115],
    [2,	1.163],
    [3,	1.195],
    [4,	1.22],
    [5,	1.245],
    [6,	1.259],
    [7,	1.275],
    [8,	1.29],
    [9,	1.299],
    [10,	1.308],
    [20,	1.36],
    [30,	1.396],
    [40,	1.410],
    [50,	1.435],
    [60,	1.452],
    [70,	1.453],
    [80,	1.454],
    [90,	1.456],
    [100,	1.459]
];



// X - power
// Y - voltage
const tmV03 = [
    [0.0001,    0.594],
    [1,	        1.465],
    [10,	    1.1660],
    [100,	    1.878]
];

const tm50ohm54dbFwd =[
    [0.0001, 594],
    [1,	1465],
    [2,	1516],
    [3,	1548],
    [4,	1575],
    [5,	1595],
    [6,	1608],
    [7,	1626],
    [8,	1640],
    [9,	1650],
    [10,	1660],
    [20,	1730],
    [30,	1775],
    [40,	1800],
    [50,	1820],
    [60,	1843],
    [70,	1850],
    [80,	1863],
    [90,	1870],
    [100,	1878]
];

const tm50ohm54dbRfl =[
    [0.0001, 425],
    [1,	1115],
    [2,	1163],
    [3,	1195],
    [4,	1220],
    [5,	1245],
    [6,	1259],
    [7,	1275],
    [8,	1290],
    [9,	1299],
    [10,	1308],
    [20,	1360],
    [30,	1396],
    [40,	1410],
    [50,	1435],
    [60,	1452],
    [70,	1453],
    [80,	1454],
    [90,	1456],
    [100,	1459]
];

function runExperiment(name, data) {
    log.info("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~", name);
    let result = regression.logarithmic(data, {precision: 6});
    log.info("R^2:                 " + result.r2, name);    
    log.info("Voltage at 1kW:      " + result.predict(1000)[1], name);    
    log.info("Voltage at 0.9kW:    " + result.predict(900)[1], name);    
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
