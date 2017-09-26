jQuery.fn.MaskTel = function(){
    return this.each(function(){
		jQuery(this).attr("maxlength",15);
        jQuery(this).keypress(function(){
			if((jQuery(this).val()).length<15){
				v = jQuery(this).val()
				v=v.replace(/\D/g,"");             //Remove tudo o que não é dígito
				v=v.replace(/^(\d{2})(\d)/g,"($1) $2"); //Coloca parênteses em volta dos dois primeiros dígitos
				v=v.replace(/(\d)(\d{3})$/,"$1-$2");
				jQuery(this).val(v)
			}
		})
    });
};

jQuery.fn.MaskTel2 = function(){
    return this.each(function(){
		jQuery(this).attr("maxlength",14);
        jQuery(this).keypress(function(){
			if((jQuery(this).val()).length<14){
				v = jQuery(this).val()
				v=v.replace(/\D/g,"");             //Remove tudo o que não é dígito
				v=v.replace(/^(\d{2})(\d)/g,"($1) $2"); //Coloca parênteses em volta dos dois primeiros dígitos
				v=v.replace(/(\d)(\d{3})$/,"$1-$2");
				jQuery(this).val(v)
			}
		})
    });
};
