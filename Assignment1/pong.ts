// FIT2102 2018 Assignment 1
// https://docs.google.com/document/d/1woMAgJVf1oL3M49Q8N3E1ykTuTu5_r28_MQPVS5QIVo/edit?usp=sharing

function pong():void {
const svg = document.getElementById("canvas")!,
    // I put many 'line' as net 
    my_net = new Elem(svg, 'line')
    .attr('x1', "300").attr('y1', "40")
    .attr('x2', "300").attr('y2', "560")
    .attr('stroke-dasharray','10 5')
    .attr('stroke','#ffffff')
    .attr('stroke-width',"0.2rem");

  //the dragPaddle function is modified from dragRect function, the function makes a paddle that player can drag, 
  //when the rectangle observes a mousedown event, the y offset is caculated and move the y coordinate of the mouse 
  //until 'mouseup' event is triggered
  function dragPaddle(svg:HTMLElement):Elem {
    const 
      mousemove = Observable.fromEvent<MouseEvent>(svg, 'mousemove'),
      mouseup = Observable.fromEvent<MouseEvent>(svg, 'mouseup');
      
    const rect = new Elem(svg, 'rect')
            .attr('x', 100)    .attr('y', 300)
            .attr('width', 10).attr('height', 50)
            .attr('fill', 'white');
    
    rect.observe<MouseEvent>('mousedown')
      .map(({clientY}) => ({ yOffset: Number(rect.attr('y')) - clientY }))
      .flatMap(({yOffset}) =>
        mousemove
          .takeUntil(mouseup)
          .map(({clientY}) => ({ y: clientY + yOffset })))
      .subscribe(({y}) =>
        rect
            .attr('y', y));
            return rect;
    }

  const rect=dragPaddle(svg);
  let speedX=3,speedY=3,scoreA=0,scoreB=0;
  const maxX=600,maxY=560,minY=40;
    //the function set a AI paddle
    function setAI():Elem{
      const rectAI = new Elem(svg, 'rect')
      .attr('x', 500) .attr('y', 300)
      .attr('width', 10).attr('height', 50)
      .attr('fill', 'white');
      
      return rectAI;
    }

    const rectAI=setAI();
      //set a ball
        const a_ball=new Elem(svg,'circle')
         .attr('cx',300)
         .attr('cy',500)
         .attr('r',5)
         .attr('fill',"white");
      
      //the movement of the ball and many branches for different functionality,
      // I got the idea from animated ball in the lecture, I use Observable.interval(), then speed is added to the 
      //ball by using a map that can change the position of the ball
      const o=Observable.interval(10)
      .map(()=>({x:speedX+Number(a_ball.attr('cx')),
                 y:speedY+Number(a_ball.attr('cy'))}))    
      o.subscribe(({x,y})=>{a_ball.attr('cx', x)
                     a_ball.attr('cy', y)})
      //movement of the AI, I let the y coordinate of AI be the y coordinate of the ball and multiply 0.95， that can 
      // make the AI slow and lose the ball some time.
      o.map(({x,y})=>({x,y:y*0.5}))
      .filter(({x})=>x>120 &&x<550)
      .subscribe(({y})=>rectAI.attr('y',y));
              
    //reset the position of the ball and record the player's score:
    //each time the player wins(the x coordinate of the ball is larger than 600) and player's score does not reach 11, 
    //score A will plus one  and reset the position of the ball
    //when the socreA is 11, it means the player wins the game and game should be finshed, so the ball will not 
    //be reset again and the score will not be plus again.
    
    o.filter(({x})=>x>=maxX &&scoreA<11)
    .subscribe(()=>{
    scoreA+=1
    const s=document.getElementById("player")!;
    s.innerHTML="player:"+String(scoreA)
    a_ball.attr('cx', 300)
    a_ball.attr('cy', 500)      
  })
 
    //reset the position of the ball and record the AI's score:
    //each time the AI wins(the x coordinate of the ball is smaller than 0) and AI's score does not reach 11, 
    //score B will plus one  and reset the position of the ball
    //when the socreB is 11, it means the AI wins the game and game should be finshed, so the ball will not 
    //be reset again and the score will not be plus again.
    
    o.filter(({x})=>x<=0&&scoreB<11)
    .subscribe(()=>{
      scoreB+=1
    const s=document.getElementById("player AI")!;
    s.innerHTML="AI:"+String(scoreB)
    a_ball.attr('cx', 300)
    a_ball.attr('cy', 500)
  
    })
  
    //game finished and display information:
    //Display the "you win" when score A is equal to 11, display "Game over" when score B is equal to 11
    o.filter(()=>scoreA==11)
      .subscribe(()=>{const my_text=document.getElementById("text")!;
      my_text.textContent="You Win!!"   
    })
    o.filter(()=>scoreB==11)   
    .subscribe(()=>{const my_text=document.getElementById("text")!;
    my_text.textContent="Game Over!!"})


    //collision with wall y and change the direction of movement of the ball
    o.filter(({y})=>y>=maxY) 
      .subscribe(()=>speedY*=-1)
    o.filter(({y})=>y<=minY)
    .subscribe(()=>speedY*=-1)

    //collision with player's paddle and change the direction of movement of the ball:
    //if the x coordinate of the ball is same with the player's paddle, y coordinate of the ball
    //is greater than the y coordinate of paddle and smaller than (y of the paddle+hegiht of the paddle)
    //then the ball should be collision with the paddle
    o.filter(({x})=>x<=Number(rect.attr('x'))+Number(rect.attr('width'))&&x>=Number(rect.attr('x')) )   
    .filter(({y})=> y>=Number(rect.attr('y')) 
          && y<=Number(rect.attr('y'))+Number(rect.attr('height')))
    .subscribe(()=>speedX*=-1)  
 
      
    //collision with AI's paddle and change the direction of movement of the ball:
    // It is just similar with the player's paddle collision
    o.filter(({x})=>x>=Number(rectAI.attr('x')) && x<=Number(rectAI.attr('x'))+Number(rectAI.attr('width')))//||x+1>=Number(rectAI.attr('x')))

      .filter(({y})=> y>=Number(rectAI.attr('y')) 
              && y<=Number(rectAI.attr('y'))+Number(rectAI.attr('height')))
    .subscribe(()=>speedX*=-1) 
          
}

// the following simply runs your pong function on window load.  Make sure to leave it in place.
if (typeof window != 'undefined')
  window.onload = ()=>{
    pong()
 
  }

 

 


