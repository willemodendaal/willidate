(function( $ ) {
  
	$.willidate = function(rules, options) {
		if (!rules)
		{
			throw('rules required');
		}
		
		var defaults = {
		  popupLocation : 'right', // right, bottom
		  hideOnHover : true
		};
		
		var settings = $.extend({}, defaults, options );

		ensureDateJSLibraryIsIncluded();

		//Hide validation messages
		$('.validation-error').hide();
		
		//Get errors...
		var errorControlsAndMessages = [];
		$.each(rules, function(index, rule) 
		{
			var ruleResult = executeRule(index, rule, errorControlsAndMessages);
			
			if (!ruleResult.success)
			{
				errorControlsAndMessages.push( {control: rule.control, message: ruleResult.message} );
			}
		});
		
		//Render errors...
		renderErrors(errorControlsAndMessages, settings);

		//Additional script
		if (settings.hideOnHover == true)
		{
			$('.validation-error').mouseenter(function() { $(this).hide() } );
		}
		
		return (errorControlsAndMessages.length == 0);
	};
  
  
	function ensureDateJSLibraryIsIncluded()
	{
		var dt = Date.parse('today');
		
		if (!dt)
		{
			throw 'willidate depends on the date.js library that can be downloaded at http://www.datejs.com/';
		}
	}
  
  
	function renderErrors(errorControlsAndMessages, settings)
	{
		$.each(errorControlsAndMessages, function(index, result) 
		{
			var $ctrl = $(result.control);
			if ($ctrl.length == 0)
			{
				alert("Unable to validate. Control '" + result.control + "' not found" );
			}

			var $popupElement = $(getPopupHtml(result.message, result.control));
			$popupElement.insertAfter($ctrl);

			var pos = $ctrl.position();
			var width = $ctrl.width();
			var height = $ctrl.height();
			
			if (settings.popupLocation == 'right')
			{
				$popupElement.css({ "left": (pos.left + width + 5) + "px", "top":pos.top + "px" }).show();
			}
			else if (settings.popupLocation == 'bottom')
			{
				$popupElement.css({ "left": pos.left + "px", "top": (pos.top + height + 5) + "px" }).show();
			}
			
			$popupElement.show();
		});
	}
	
	function getPopupHtml(message, controlSelector)
	{
		return "<div style=\"position:absolute; display:none;\" for=\"" + controlSelector + "\" class=\"validation-error\">" + message + "</div>";
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
		if (rule.numeric == true)
		{
			if (!valueIsNumeric(ctrl))
			{
				return { success: false, message: 'Must be Numeric' };
			}
		}
		if (rule.date == true)
		{
			if (!valueIsDate(ctrl))
			{
				return { success: false, message: 'Must be a Date' };
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

	
	function valueIsNumeric($control)
	{
		var val = $control.val();
		if (val == '' || val == undefined || val == null)
		{
			//Empty is OK. This should return true.
			return true;
		}
		
		return isNumber(val);
	}

	function valueIsDate($control)
	{
		var val = $control.val();
		if (val == '' || val == undefined || val == null)
		{
			//Empty is OK. This should return true.
			return true;
		}
		
		// Parse the string to Date using datejs from http://www.datejs.com/
		var dt = Date.parse(val);
		
		return dt != null;
	}
	
	function isNumber(n) 
	{
		return !isNaN(parseFloat(n)) && isFinite(n);
	}
})( jQuery );