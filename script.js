$(document).ready(function(){
  $(".rhythmic.step").click(function(){
    let stepClasses = ['on','on-loud','off'];
    $(this).each(function(){
      this.className = stepClasses[($.inArray(this.className, stepClasses)+1)%stepClasses.length];
    });
  });
  $(".melodic.step").click(function(){
    let stepClasses = ['on','on-loud','off'];
    $(this).each(function(){
      this.className = stepClasses[($.inArray(this.className, stepClasses)+1)%stepClasses.length];
    });
  });
});
