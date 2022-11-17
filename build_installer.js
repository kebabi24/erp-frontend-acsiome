const {MSICreator} = require('electron-wix-msi');
const path = require('path');

const APP_DIR  = path.resolve('C:\\Users\\DELL\\projects\\erp-frontend-acsiome\\abracadabra-win32-x64');
const OUT_DIR = path.resolve(__dirname, './abra');

const msiCreator = new MSICreator({
    appDirectory: APP_DIR,
    outputDirectory: OUT_DIR,
    description:'Abracadabra ERP', 
    exe: 'abracadabra', 
    name:'abra', 
    manufacturer: 'sbst', 
    version:'1.0.0',
    ui:{
        chooseDirectory:true
    }
});
msiCreator.create().then(function(){
    msiCreator.compile()
})