var canvas, ctx, image, map, x, y, requestID;

// canvas サイズ
var width = 400;
var height = 400;

// 何フレーム毎に次の世代に進むか
var refreshRate = 4;

var initialize = function() {
  // canvas エレメントを生成
  canvas = document.createElement('canvas');
  document.body.appendChild(canvas);
  canvas.setAttribute('width', width);
  canvas.setAttribute('height', height);
  ctx = canvas.getContext('2d');

  // 初期データ生成
  map = [];
  for (x = 0; x < width+2; x++) {
    map.push([]);
    for (y = 0; y < height+2; y++) {
      if ( x === 0 || y === 0 || x === width+1 || y === height+1 ) {
        map[x][y] = false;
      } else {
        map[x][y] = Math.random() < 0.1;
      }
    }
  }

  // ループ開始
  loop();
};

// ループ処理
var frame = 0;
var loop = function() {
  requestID = requestAnimationFrame(loop);
  frame = ( frame + 1 ) % refreshRate;
  if ( frame === 0 ) {
    nextStep();
  }
};

var nextStep = function() {
  var count, value;
  var newMap = [];
  var base = 0;
  image = ctx.getImageData(0,0,width,height);
  for (x = 0; x < width+2; x++) {
    newMap.push([]);
    for (y = 0; y < height+2; y++) {
      if ( x === 0 || y === 0 || x === width+1 || y === height+1 ) {
        newMap[x][y] = false;
        continue;
      }
      // 近傍の生存セルをカウント
      count = ( map[x-1][y-1] ? 1 : 0 )
            + ( map[x  ][y-1] ? 1 : 0 )
            + ( map[x+1][y-1] ? 1 : 0 )
            + ( map[x-1][y  ] ? 1 : 0 )
            + ( map[x+1][y  ] ? 1 : 0 )
            + ( map[x-1][y+1] ? 1 : 0 )
            + ( map[x  ][y+1] ? 1 : 0 )
            + ( map[x+1][y+1] ? 1 : 0 );
      newMap[x][y] = ( map[x][y] && count === 2 ) || count === 3;
      // セルに対応するピクセルを描画
      value = newMap[x][y] ? 0 : 255;
      image.data[base+0] = value;
      image.data[base+1] = value;
      image.data[base+2] = value;
      image.data[base+3] = 255;
      base += 4;
    }
  }
  map = newMap;
  ctx.putImageData(image, 0, 0);
};

var toggleAnimation = function() {
  if ( requestID ) {
    cancelAnimationFrame(requestID);
    requestID = null;
  } else {
    loop();
  }
};

initialize();
