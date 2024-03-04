import { MSICreator } from 'electron-wix-msi';

// Step 1: Instantiate the MSICreator
const msiCreator = new MSICreator({
    appDirectory: 'D:/errp/erp-frontend-acsiome/edelweiss',
    description: 'Edelweiss',
    exe: 'edelweiss',
    name: 'edelweiss',
    manufacturer: 'Acsiome Technologies',
    version: '1.1.2',

    iconUrl: "D:/errp/erp-frontend-acsiome/edelweiss/favicon.ico",
    setupIcon: "D:/errp/erp-frontend-acsiome/edelweiss/favicon.ico",
    outputDirectory: 'D:/errp/erp-frontend-acsiome/edelweiss/app'
});

// Step 2: Create a .wxs template file
const supportBinaries = await msiCreator.create();

// 🆕 Step 2a: optionally sign support binaries if you
// sign you binaries as part of of your packaging script
supportBinaries.forEach(async (binary) => {
    // Binaries are the new stub executable and optionally
    // the Squirrel auto updater.
    await signFile(binary);
});

// Step 3: Compile the template to a .msi file
await msiCreator.compile();