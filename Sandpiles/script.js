var grid, largePiles = [];
var width = 1001, height = 1001;
var maxPile = 3;

var canvas, context;
var largePileCount = 0;

function init(){
    canvas = document.getElementById("mainCanv");
    context = canvas.getContext("2d");
    grid = [];
    for (var i = 0; i < width; i++) {
        grid[i] = [];
        for (var j = 0; j < height; j++) {
            grid[i][j] = 0;
        };
    }
}

function addSandPile(x, y, pileSize){
    grid[x][y] += pileSize;
    if (grid[x][y] > maxPile) {
        largePiles[2*largePileCount] = x;
        largePiles[(2*largePileCount++) + 1] = y;
    }
}

function toppleOptimized(){
    var time = new Date().getTime();
    var done = false;
    var newLargePile;
    var x, y;
    var n = 0;
    while(largePileCount > 0){
        x = largePiles[--largePileCount*2];
        y = largePiles[largePileCount*2 + 1];
        if(n==10000000){
            console.log("a");
            drawToCanvas();
        }
        n++;
        grid[x][y] = Math.max(grid[x][y] - 4, 0);
        if (grid[x][y] > maxPile) {
            largePiles[2*largePileCount] = x;
            largePiles[(2*largePileCount++) + 1] = y;
        }
        if (x > 0) {
            if(grid[x-1][y] == maxPile) {
                largePiles[2*largePileCount] = x-1;
                largePiles[(2*largePileCount++) + 1] = y;
            }
            grid[x-1][y]++;
        }
        if (x < width-1) {
            if(grid[x+1][y] == maxPile) {
                largePiles[2*largePileCount] = x+1;
                largePiles[(2*largePileCount++) + 1] = y;
            }
            grid[x+1][y]++;
        }
        if (y > 0) {
            if(grid[x][y-1] == maxPile) {
                largePiles[2*largePileCount] = x;
                largePiles[(2*largePileCount++) + 1] = y-1;
            }
            grid[x][y-1]++;
        }
        if (y < height - 1) {
            if(grid[x][y+1] == maxPile) {
                largePiles[2*largePileCount] = x;
                largePiles[(2*largePileCount++) + 1] = y+1;
            }
            grid[x][y+1]++;
        }
    }
    console.log((new Date().getTime() - time)/1000);
}

function topple(){
    var time = new Date().getTime();
    var done = false;
    var xLowerBound = 498, xUpperBound = 500, yLowerBound = 498, yUpperBound = 500, xMax, yMax;
    var n = 0;
    while (!done){
        if(n==10000){
            console.log(grid[499][499]+ " xub:"+xUpperBound+ " yub:"+yUpperBound + " xlb:"+xLowerBound+ " ylb:"+yLowerBound);
            n=0;
        }
        n++;
        done = true;
        xMax = xUpperBound;
        yMax = yUpperBound;
        for (var x = xLowerBound; x <= xMax; x++){
            for (var y = yLowerBound; y <= yMax; y++){
                if (grid[x][y] > maxPile) {
                    done = false;
                    grid[x][y] = Math.max(grid[x][y] - 4, 0);
                    if (x > 0) {
                        grid[x-1][y]++;
                        if ((x-1) < xLowerBound) xLowerBound = x-1;
                    }
                    if (x < width-1) {
                        grid[x+1][y]++;
                        if ((x+1) > xUpperBound) xUpperBound = x+1;
                    }
                    if (y > 0) {
                        grid[x][y-1]++;
                        if ((y-1) < yLowerBound) yLowerBound = y-1;
                    }
                    if (y < height - 1) {
                        grid[x][y+1]++; 
                        if ((y+1) > yUpperBound) yUpperBound = y+1;
                    }
                }
            }
        }
    }
    console.log((new Date().getTime() - time)/1000);
}

function drawToCanvas(){
    var imageData = context.createImageData(width, height);
    var data = imageData.data;
    for (var x = 0; x < width; x++){
        for (var y = 0; y < height; y++){
            data[((y*(imageData.width*4)) + (x*4)) + (3-grid[x][y])] = 255;
            data[((y*(imageData.width*4)) + (x*4)) + 3] = 255;
        }
    }
    context.putImageData(imageData, 0, 0);
}