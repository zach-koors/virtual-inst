const audioContext = new AudioContext;

$(document).ready(function() {

  $("#play").click(function() {
    if(audioContext.state === 'suspended'){
      audioContext.resume();
    }
    Tone.start();
  });

  //the function that enables the rhythmic step buttons to cycle through states when clicked
  $(".rhythmic.step").click(function() {
    let stepClasses = [
      'rhythmic step on',
      'rhythmic step on-loud',
      'rhythmic step off'
    ];
    $(this).each(function() {
      this.className = stepClasses[($.inArray(this.className, stepClasses)+1)%stepClasses.length];
    });
  });

  //the function that enables the melodic step buttons to cycle through pitches/states when clicked
  $(".melodic.step").click(function() {
    let melodicNote = ['0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '•'
    ];
    $(this).each(function() {
      this.textContent = melodicNote[($.inArray(this.textContent, melodicNote)+1)%melodicNote.length];
    });


    let stepClasses = [
      'melodic step on 0',
      'melodic step on 1',
      'melodic step on 2',
      'melodic step on 3',
      'melodic step on 4',
      'melodic step on 5',
      'melodic step on 6',
      'melodic step on 7',
      'melodic step on 8',
      'melodic step on 9',
      'melodic step off'
    ];
    $(this).each(function() {
      this.className = stepClasses[($.inArray(this.className, stepClasses)+1)%stepClasses.length];
    });
  });


  function sequencer() {

    //the instrument/player constants
    const kick = new Tone.Player("./sounds/kick2.wav").toDestination();
    const snare = new Tone.Player("./sounds/snare2.wav").toDestination();
    const hihat = new Tone.Player("./sounds/hihat2.wav").toDestination();
    const bass = new Tone.Player("./sounds/bass2.wav").toDestination();

    let i = 0;

    //the function that is executed on each step of the sequence
    function loopThroughSteps() {
      let step = i % 8;

      let kickStep = $(".kick .step:nth-child(" + (step+1) + ")");
      if(kickStep.hasClass("on")){
        kick.volume.value = -12;
        kick.stop();
        kick.start();
      }
      if(kickStep.hasClass("on-loud")){
        kick.volume.value = 0;
        kick.stop();
        kick.start();
      }

      let snareStep = $(".snare .step:nth-child(" + (step+1) + ")");
      if(snareStep.hasClass("on")){
        snare.volume.value = -12;
        snare.stop();
        snare.start();
      }
      if(snareStep.hasClass("on-loud")){
        snare.volume.value = 0;
        snare.stop();
        snare.start();
      }

      let hihatStep = $(".hi-hat .step:nth-child(" + (step+1) + ")");
      if(hihatStep.hasClass("on")){
        hihat.volume.value = -12;
        hihat.stop();
        hihat.start();
      }
      if(hihatStep.hasClass("on-loud")){
        hihat.volume.value = 0;
        hihat.stop();
        hihat.start();
      }

      console.log(step);
      i++;
    }

    function startTransport() {
      Tone.Transport.start();
      console.log("Transport started");
    }

    function stopTransport() {
      Tone.Transport.stop();
      console.log("Transport stopped");
    }

    //defining that the transport will loop through 8 steps
    Tone.Transport.scheduleRepeat(loopThroughSteps, "8n");
  
    
    //play button starts/stops the transport
    $("#play").click(function(){
      if ($(this).hasClass('text-secondary')){
        startTransport();
        $(this).removeClass('text-secondary').addClass('text-white');
      } else {
        stopTransport();
        $(this).removeClass('text-white').addClass('text-secondary');
      }
    });


    //when 16ths button is pressed, the steps are converted to 16th notes (double time)
    $("#time-signature").click(function(){
      if ($(this).hasClass('text-secondary')){
        Tone.Transport.bpm.value = Tone.Transport.bpm.value * 2;
        $(this).removeClass('text-secondary').addClass('text-white');
      } else {
        Tone.Transport.bpm.value = Tone.Transport.bpm.value / 2;
        $(this).removeClass('text-white').addClass('text-secondary');
      }
    });




    $("#tempo").click(function(){
      let tempoValues = [
        '144bpm',
        '160bpm',
        '180bpm',
        '72bpm',
        '90bpm',
        '108bpm',
        '120bpm'
      ];
      $(this).each(function(){
        this.textContent = tempoValues[($.inArray(this.textContent, tempoValues)+1)%tempoValues.length];
        Tone.Transport.bpm.value = parseInt(tempoValues[($.inArray(this.textContent, tempoValues))%tempoValues.length], 10);
        console.log(Tone.Transport.bpm.value + 'bpm');
      })
    });

  };

  sequencer();

});