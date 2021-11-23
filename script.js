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
    let melodicNote = [
    'D',
    'E',
    'F',
    'G',
    'A',
    'B',
    'C',
    'd',
    'e',
    'f',
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
    // const pitchShift = new Tone.PitchShift().toDestination();
    // pitchShift.pitch = -3;
    const kick = new Tone.Player("./sounds/kick.m4a").toDestination();
    const snare = new Tone.Player("./sounds/snare.m4a").toDestination();
    const hihat = new Tone.Player("./sounds/hihat2.wav").toDestination();
    const bass = new Tone.Sampler({
      urls: {
        A4: "./sounds/bass2.wav"
      }
    }).toDestination();
    bass.volume.value = -4.5;
    const melody = new Tone.Sampler({
      urls: {
        C3: "./sounds/kalimba.wav"
      }
    }).toDestination();
    melody.volume.value = -6;

    

    let i = 0;

    //the function that is executed on each step of the sequence
    function loopThroughSteps() {
      let step = i % 8;

      let melodyStep = $(".melody .step:nth-child(" + (step+1) + ")");
      if(melodyStep.hasClass("0")){
        melody.releaseAll();
        melody.triggerAttack("D2");
      } else if(melodyStep.hasClass("1")){
        melody.releaseAll();
        melody.triggerAttack("E2");
      } else if(melodyStep.hasClass("2")){
        melody.releaseAll();
        melody.triggerAttack("F2");
      } else if(melodyStep.hasClass("3")){
        melody.releaseAll();
        melody.triggerAttack("G2");
      } else if(melodyStep.hasClass("4")){
        melody.releaseAll();
        melody.triggerAttack("A2");
      } else if(melodyStep.hasClass("5")){
        melody.releaseAll();
        melody.triggerAttack("B2");
      } else if(melodyStep.hasClass("6")){
        melody.releaseAll();
        melody.triggerAttack("C3");
      } else if(melodyStep.hasClass("7")){
        melody.releaseAll();
        melody.triggerAttack("D3");
      } else if(melodyStep.hasClass("8")){
        melody.releaseAll();
        melody.triggerAttack("E3");
      } else if(melodyStep.hasClass("9")){
        melody.releaseAll();
        melody.triggerAttack("F3");
      }

      let bassStep = $(".bass .step:nth-child(" + (step+1) + ")");
      if(bassStep.hasClass("0")){
        bass.releaseAll();
        bass.triggerAttack("D4");
      } else if(bassStep.hasClass("1")){
        bass.releaseAll();
        bass.triggerAttack("E4");
      } else if(bassStep.hasClass("2")){
        bass.releaseAll();
        bass.triggerAttack("F4");
      } else if(bassStep.hasClass("3")){
        bass.releaseAll();
        bass.triggerAttack("G4");
      } else if(bassStep.hasClass("4")){
        bass.releaseAll();
        bass.triggerAttack("A4");
      } else if(bassStep.hasClass("5")){
        bass.releaseAll();
        bass.triggerAttack("B4");
      } else if(bassStep.hasClass("6")){
        bass.releaseAll();
        bass.triggerAttack("C5");
      } else if(bassStep.hasClass("7")){
        bass.releaseAll();
        bass.triggerAttack("D5");
      } else if(bassStep.hasClass("8")){
        bass.releaseAll();
        bass.triggerAttack("E5");
      } else if(bassStep.hasClass("9")){
        bass.releaseAll();
        bass.triggerAttack("F5");
      }

      let kickStep = $(".kick .step:nth-child(" + (step+1) + ")");
      if(kickStep.hasClass("on")){
        kick.volume.value = -18;
        kick.stop();
        kick.start();
      }
      if(kickStep.hasClass("on-loud")){
        kick.volume.value = -9;
        kick.stop();
        kick.start();
      }

      let snareStep = $(".snare .step:nth-child(" + (step+1) + ")");
      if(snareStep.hasClass("on")){
        snare.volume.value = -18;
        snare.stop();
        snare.start();
      }
      if(snareStep.hasClass("on-loud")){
        snare.volume.value = -12;
        snare.stop();
        snare.start();
      }

      let hihatStep = $(".hi-hat .step:nth-child(" + (step+1) + ")");
      if(hihatStep.hasClass("on")){
        hihat.volume.value = -18;
        hihat.stop();
        hihat.start();
      }
      if(hihatStep.hasClass("on-loud")){
        hihat.volume.value = -9;
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
  };

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

  $("#save").click(() => {
    const steps = Array.from($('.step'));
    let stepStates = steps.map( element => {
      return element.className;
    })
    console.log(stepStates);
    
    $("#lower-section").append($("<div></div>").text("'Save' feature under construction...").addClass("save-form p-2").attr('id', 'under-construction'));
  });

  $("#lower-section").click((event) => {
    if(event.target.id === 'under-construction'){
      $("#under-construction").remove();
    };
  });

  sequencer();

});