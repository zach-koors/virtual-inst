$(document).ready(function(){
  $(".rhythmic.step").click(function(){
    let stepClasses = ['rhythmic step on','rhythmic step on-loud','rhythmic steo off'];
    $(this).each(function(){
      this.className = stepClasses[($.inArray(this.className, stepClasses)+1)%stepClasses.length];
    });
  });
  $(".melodic.step").click(function(){
    let stepClasses = ['melodic step on 0','melodic step on 1','melodic step on 2','melodic step on 3','melodic step on 4','melodic step on 5','melodic step on 6','melodic step on 7','melodic step on 8','melodic step on 9','melodic step off'];
    $(this).each(function(){
      this.className = stepClasses[($.inArray(this.className, stepClasses)+1)%stepClasses.length];
    });
  });
});
