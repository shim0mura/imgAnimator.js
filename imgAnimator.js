function imgAnimator(cont, imgs, options){
  if(cont.nodeType != 1){
    throw new TypeError();
  }
  if(!imgs instanceof Array || imgs.length < 1){
    throw new TypeError();
  }
  
  var l = imgs.length, timer = null, style = cont.style,
      loop = options.loop ? !!options.loop : false,
      duration = options.duration || 1000,
      fps = loop ? (options.fps || 30) : options.duration / l,
      easing = options.easing || function(){},
      frames = [], loadFrame = 0, loaded = false, curFrame = -1,
      start, lTime;

  options.preprocess && options.preprocess();
  style.backgroundRepeat = "no-repeat";

  for(var i=0;i<l;i++){
    frames[i] = new Image();
    frames[i].onload = load;
    frames[i].src = imgs[i];
  }

  function load(){
    loadFrame++;
    if(loadFrame == l){
      loaded = true;
      if(options.startOnLoad){
        start();
      }
    }
  }

  function update(){
    var cur = new Date().getTime();
    if((cur - lTime) > fps){
      curFrame++;
      lTime = cur;
      style.backgroundImage = "url(" + frames[(curFrame)%l].src + ")";
      style.backgroundPosition = easing(curFrame);
    }
    if(checkStop(cur)){
      stop();
    }
  }

  function start(){
    if(!loaded){
      setTimeout(start, 100);
    }else{
      sTime = lTime = new Date().getTime();
      timer = setInterval(update, 20);
    }
  }

  function stop(){
    clearInterval(timer);
    options.callback && options.callback();
  }

  var checkStop = (function(){
    if(loop){
      return function(cur){
        if(duration < cur - sTime){
          return true;
        }else{
          return false;
        }
      };
    }else{
      return function(){
        if(curFrame === loadFrame-1){
          return true;
        }else{
          return false;
        }
      };
    }
  })();
  
  return {
    start: start,
    stop: stop
  };
}
