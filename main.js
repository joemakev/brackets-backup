define(function (require, exports, module) {
    "use strict";
    
    //Load bracket modules
    var CommandManager  = brackets.getModule("command/CommandManager"),
        Menus           = brackets.getModule("command/Menus"),
        FileUtils       = brackets.getModule("file/FileUtils"),
        DocumentManager = brackets.getModule("document/DocumentManager"),
        FileSystem      = brackets.getModule("filesystem/FileSystem"),
        File            = brackets.getModule("filesystem/File");
    
    //Main variables
    var backupInterval = 'undefined',
        backupTime = 180000 /*300000 MS = 5 mins., 180000 MS = 3mins.*/,
        isAutoBackup = false;

    /* --- Main Functions ---  */
    function createFileBackup() {
        console.log('createFileBackup()');
        
        //Clear auto backup job
        if(isAutoBackup) clearInterval(backupInterval);
        
        //Get the current document
        var currDoc = DocumentManager.getCurrentDocument();
        
        //console.log(currDoc);
        if(typeof currDoc != 'undefined' && currDoc != null) {
            var currDocTxt = currDoc.getText(); 

            //Set path and file variables
            var currDocFile = currDoc.file;
            var currDocOrigPath = currDoc.file._path;
            var currDocBakPath = currDocOrigPath+'.bak';

            //Change doc path to bak
            currDoc.file._path = currDocBakPath;

            //Create/write the backup file
            var options = {};
            options.blind = true;
            currDocFile.write(currDocTxt, options);

            //Change doc path to orig
            currDoc.file._path = currDocOrigPath;
        }
        
        //Restart the auto backup, if enabled
        if(isAutoBackup) startAutoBackup();
        
    } //end of createFileBackup()
    
    function startAutoBackup() {
        console.log('startAutoBackup()');
        if(!isAutoBackup) {
            menu.removeMenuItem(START_AUTO_BACKUP);
            menu.addMenuItem(STOP_AUTO_BACKUP);
            isAutoBackup = true;
        }
        clearInterval(backupInterval);
        backupInterval = window.setInterval(function() {
            console.log('[autoBackup]');
            createFileBackup();
        }, backupTime);
    }
    
    function stopAutoBackup() {
        menu.addMenuItem(START_AUTO_BACKUP);
        menu.removeMenuItem(STOP_AUTO_BACKUP);
        isAutoBackup = false
        console.log('stopAutoBackup()');
        clearInterval(backupInterval);
    }
    
    function dummyFunction() {
        console.log('dummyFunction()');
    }
    
    
    /* --- Register Commands --- */
    var CREATE_FILE_BACKUP = "bracketsBackup.createFileBackup";
    CommandManager.register("Backup - CREATE", CREATE_FILE_BACKUP, createFileBackup);
    
    var START_AUTO_BACKUP = "bracketsBackup.startAutoFileBackup";
    CommandManager.register("Backup - START Auto", START_AUTO_BACKUP, startAutoBackup);
    
    var STOP_AUTO_BACKUP = "bracketsBackup.stopAutoBackup";
    CommandManager.register("Backup - STOP Auto", STOP_AUTO_BACKUP, stopAutoBackup);
    
    
    /* --- Create Menu Item --- */
    var menu = Menus.addMenu("Backup", 'Backup', Menus.AFTER, Menus.AppMenuBar.FILE_MENU);
    menu.addMenuItem(CREATE_FILE_BACKUP);
    menu.addMenuItem(START_AUTO_BACKUP);
    
    
});