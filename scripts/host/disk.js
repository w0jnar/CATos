//disk.js
//implementation of the File System, to be dealt with by deviceDriverFileSystem.js

function FileSystem()
{
    this.disk    	= sessionStorage;   //personally though Session Storage made more sense than Local
    this.tracks     = _MaxTracks;  		//no magic numbers here!
    this.sectors    = _MaxSectors;
    this.blocks     = _MaxBlocks;
    this.bytes 		= _MaxBytes;

    this.init = function()
    {
        var tsbKey = "";
        var data = "";

        for (var t = 0; t < this.tracks; t++) //track loop
        {
            for (var s = 0; s < this.sectors; s++) //sector loop
            {
                for (var b = 0; b < this.blocks; b++) //block loop
                {
                    tsbKey = t.toString() + "," + s.toString() + "," + b.toString(); //create the tsbKey and add it to the disk
                    this.disk.setItem(tsbKey, data);
                }
            }
        }
    };
}
