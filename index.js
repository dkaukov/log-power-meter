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
    [1,	1.206],
    [2,	1.253],
    [3,	1.282],
    [4,	1.309],
    [5,	1.328],
    [6,	1.342],
    [7,	1.368],
    [8,	1.37],
    [9,	1.378],
    [10,	1.386],
    [11,	1.39],
    [12,	1.4],
    [13,	1.408],
    [14,	1.414],
    [15,	1.422],
    [16,	1.429],
    [17,	1.43],
    [18,	1.435],
    [19,	1.44],
    [20,	1.444],
    [21,	1.448],
    [22,	1.45],
    [30,	1.482],
    [50,	1.52],
    [60,	1.55],
    [70,	1.56],
    [80,	1.58],
    [90,	1.585],
    [100,	1.59]];

// X - power
// Y - voltage
const tmV02 = [
    [1,	1.025],
    [2,	1.07],
    [3,	1.098],
    [4,	1.12],
    [5,	1.14],
    [6,	1.151],
    [7,	1.167],
    [8,	1.18],
    [9,	1.19],
    [10,	1.195],
    [11,	1.2],
    [12,	1.207],
    [13,	1.216],
    [14,	1.223],
    [15,	1.231],
    [16,	1.237],
    [17,	1.232],
    [18,	1.248],
    [19,	1.252],
    [20,	1.257],
    [21,	1.26],
    [30,	1.304],
    [50,	1.334],
    [60,	1.37],
    [70,	1.38],
    [80,	1.39],
    [90,	1.4],
    [100,	1.408]
];


// X - power
// Y - voltage
const tmV03 = [
    [0.0001,    0.5],
    [1,	        1.025],
    [10,	    1.195],
    [100,	    1.408]
];

const tm50ohm54dbFwd =[
    [1,	1.165],
    [2,	1.516],
    [3,	1.552],
    [4,	1.575],
    [5,	1.595],
    [6,	1.61],
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
    [100,	1.878]
];

const tm50ohm54dbRfl =[
    [1,	1.095],
    [2,	1.143],
    [3,	1.182],
    [4,	1.205],
    [5,	1.23],
    [6,	1.242],
    [7,	1.26],
    [8,	1.275],
    [9,	1.285],
    [10,	1.295],
    [20,	1.36],
    [30,	1.396],
    [40,	1.41],
    [50,	1.435],
    [60,	1.452],
    [70,	1.453],
    [80,	1.454],
    [90,	1.456],
    [100,	1.459]
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
