(function($,config) {
	// We do all of this inside an anonymous closure to avoid polluting the global namespace

	var build_toolbar_button = function(spec) {
		var container = $('<div/>');
		
		for (var i=0;i<spec.length;i++) {
			var group = $('<div class="monster_toolbar_group"></div>');
			
			var group_spec = spec[i];
			
			for (var j=0;j<group_spec.length;j++) {
				var button = $('<a href="#" class="monster-button"></a>');		
				var button_spec = group_spec[j];
				
				button.text(button_spec.label);

				if (button_spec.cssClass !== undefined) {
					button.addClass(button_spec.cssClass);
				}
				
				group.append(button);	
				
				button.click(function(ev){
					button_spec.callback();
					return false;
				});		
			}
			
			container.append(group);
		}
		
		return container;
	};

	var region_editor = function(spec,my){
		var that = MONSTER.editor(spec,my);
		
		var toolbar = $('<div id="monster-toolbar"><div id="monster-toolbar-inner"><div class="monster-toolbar-right"></div></div></div>');
		var placeholder = $('<div />');
		
		placeholder.hide();
		toolbar.hide();
		
		var button_spec = [
			[
			 { label: 'Cancel', callback: function(){ that.cancel(); } },
			 { label: 'Reload Template', callback: function(){ that.reload(); } }
			],
			[
			 { label: 'Save', callback: function(){ that.save(); }, cssClass: 'primary' }
			]
		];
		
		toolbar.append(build_toolbar_button(button_spec));
		
		$('body').prepend(toolbar);
		toolbar.after(placeholder);
		
		placeholder.height(toolbar.outerHeight());
		
		toolbar.add(placeholder).slideDown('fast');
		
		spec.edit_handler.fadeOut('fast');
		
		that.save = function(){
			that.render(function(html){
				console.log(html);
			});
		};
		
		that.cancel = function(){
			
		};
		
		that.reload = function(){
			
		};
		
		return that;
	};
	
	var absolutes_list = [];
	
	var reposition_absolutes = function(){
		for (var i = 0; i < absolutes_list.length; i++){
			var icon = absolutes_list[i];
			var offset = icon[1].offset();
	
			icon[0].css('top',offset.top + icon[2] + 'px');	
			icon[0].css('left',offset.left + icon[3] + 'px');
		}
	};
	
	$(document).ready(function(){
		
		$('.monster-region').each(function(i){
						
			var node = $(this);			
			var handler = $('<span class="monster-icon monster-edit">Enable Editing</span>');
	
			var icon = [handler,node,0,-88];
			
			absolutes_list.push(icon);
			
			$('body').prepend(handler);
			
			handler.data('node',node);
	
			handler.click(function(){
				var node = $(this).data('node');
				
				var key = node.attr('m:key');
				var id = node.attr('m:id');
				var uri = config.service_location + 'regions/' + id + '/';
				
				$.getJSON(uri,function(data){
					
					var spec = {
						'node': node,
						'data': data.data || null,
						'revert_state': node.html,
						'save_uri': uri,
						'edit_handler': handler 
					};
					
					node.html(data.template);
			
					var editor = region_editor(spec);				
					
				});
			});
		});
	
		$(window).bind('resize', reposition_absolutes);
	
		reposition_absolutes();		
		
	});

})(jQuery,MONSTER_CONFIG);