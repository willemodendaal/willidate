(function( $ ) {
  
	$.willidate = function(rules) {
		if (!rules)
		{
			throw('rules required');
		}
		
		var errorControlsAndMessages = [];
		$.each(rules, function(index, rule) 
		{
			var ruleResult = executeRule(index, rule, errorControlsAndMessages);
			
			if (!ruleResult.success)
			{
				errorControlsAndMessages.push( {control: rule.control, message: ruleResult.message} );
			}
		});
		
		renderErrors(errorControlsAndMessages);
		
		return (errorControlsAndMessages.length == 0);
	};
  
  
	function renderErrors(errorControlsAndMessages)
	{
		$.each(errorControlsAndMessages, function(index, result) 
		{
			var ctrl = $(result.control);
			if (ctrl.length == 0)
			{
				alert("Unable to validate. Control '" + result.control + "' not found" );
			}
			
			ctrl.hide();
		});
	}
  
  
	function executeRule(index, rule, errorControlsAndMessages) 
	{
		if (!rule.control)
		{
			return { success: true };
		}
		
		var ctrl = $(rule.control);
		if (ctrl.length == 0)
		{
			return { success: false, message: "Unable to validate. Control '" + rule.control + "' not found" };
		}
		
		if (rule.required == true)
		{
			if (!requiredControlHasValue(ctrl))
			{
				return { success: false, message: 'Required' };
			}
		}
		
		return { success: true };
	}
  
  
	function requiredControlHasValue($control)
	{
		var val = $control.val();
		if (val != '' && val != undefined && val != null)
		{
			return true;
		}
		else
		{
			return false;
		}
	}
})( jQuery );