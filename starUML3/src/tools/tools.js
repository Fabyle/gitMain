/*--------------------------------------------------------------------
 * TOOLS 
 * 
 */

function streamToString(stream, cb, template) {
	 //stream.pipe(process.stdout);
	  const chunks = [];
	  
	  stream.on('data', function(chunk) {
		  
	    chunks.push(chunk);
	  });
	  stream.on('end', function() {
		
	    cb(chunks.join(''),template);
	  });
	};

/*-------------------------------------------------------------------------*/
function lancerStarUML() {
	const exec = require('child_process').exec;
	exec('launcher.cmd', 
		function(err, stdout, stderr)  {
		if (err) {
			console.error(err);
			return;
		}
		console.log(stdout);
		});
};

//les exports
exports.streamToString = streamToString;
exports.lancerStarUML = lancerStarUML;
