(function($,config) {
	// We do all of this inside an anonymous closure to avoid polluting the global namespace
	
	// Replace default imagefield with one that allows file uploadss, hacky but cool.
	MONSTER.fields.imagefield = function(spec,my){
	
		var that = MONSTER.base.field(spec,my);
		
		// Returns a value from the field (and calls the second callback)
		that.write = function(){
			that.set_value(that.field_node.find('input[name=dialog-field-'+that.data_name+']').val());
		};
		
		that.prepare = function(){
			var html = '<label for="dialog-field-' +that.data_name+ '">'+that.verbose_name+'</label><div><form><input type="file" name="dialog-field-'+that.data_name+'-file" id="dialog-field-'+that.data_name+'-file" /></form><br/><input name="dialog-field-'+that.data_name+'"></input><br/><img src="" style="margin-top: 8px; max-width: 359px;" /></div>';
			var data = that.get_value();
			
			that.field_node = $(html);
			
			var upload_uri = config.service_location + 'upload/';
			var uploader = that.field_node.find('input#dialog-field-'+that.data_name+'-file');

			uploader.change(function(e){
				$.ajaxFileUpload({
	                url: upload_uri,
	                secureuri: false,
	                fileElement: uploader,
	                dataType: 'json',
	                success: function (data, status) {
						that.field_node.find('input[name=dialog-field-'+that.data_name+']').val(data.filename);
						that.field_node.find('input[name=dialog-field-'+that.data_name+']').change();
	                },
	                error: function (data, status, e) {
	                	// uh oh
	                }
	            });
				
				return false;
			});	
			

			if (data) {
				that.field_node.find('input[name=dialog-field-'+that.data_name+']').val(data);
				that.field_node.find('img').attr('src',data);
			}
			
			that.field_node.find('input[name=dialog-field-'+that.data_name+']').change(function(e){
				that.field_node.find('img').attr('src',$(this).val());
			});
			
			return that.field_node;
		};	
	
		return that;
	};	
	

	var build_toolbar_button = function(spec) {
		var container = $('<div class="monster_toolbar_buttons" />');
		
		for (var i=0;i<spec.length;i++) {
			var group = $('<div class="monster_toolbar_group"></div>');
			
			var group_spec = spec[i];
			
			for (var j=0;j<group_spec.length;j++) {
				
				(function(button_spec){
					
					var button = $('<a href="#" class="monster-button"></a>');		
					
					button.text(button_spec.label);
	
					if (button_spec.cssClass !== undefined) {
						button.addClass(button_spec.cssClass);
					}
					
					button.click(function(ev){
						button_spec.callback();
						return false;
					});
					group.append(button);
				})(group_spec[j]);
			
			}
			
			container.append(group);
		}
		
		return container;
	};
	
	var addHideKey = function()  {
		MONSTER.hidekey = $(document).shortkeys({
			'h': function()  {
				$('.monster-edit').each(function() {
					if ($(this).css('display') == 'none') {
						$(this).css('display', 'block');
					}
					else {
						$(this).css('display', 'none');
					}
				});
			}
		});
	};
	
	var region_editor = function(spec,my){
		var that = MONSTER.editor(spec,my);
		
		var toolbar = $('<div id="monster-toolbar"></div>');
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
				var put_data = {
					'data': $.toJSON(that.get_data()),
					'rendered': html,
					'template': spec.template
				};
				
				$.ajax({
				  type: 'PUT',
				  url: spec.save_uri,
				  data: put_data,
				  dataType: 'text',
				  success: function(data){
					spec.node.html(html);
					toolbar.add(placeholder).slideUp('fast').remove();
					spec.edit_handler.fadeIn('fast');
					$('.monster-icon monster-edit').show();
					addHideKey();
					
				  },
				  error: function(request,status,error) {
				  	// something went wrong
				  }
				});	
				
			});
		};
		
		that.cancel = function(){
			spec.node.html(spec.revert_state);
			toolbar.add(placeholder).slideUp('fast').remove();
			spec.edit_handler.fadeIn('fast');
			$('.monster-icon monster-edit').show();
			addHideKey();
			
		};
		
		that.reload = function(){
			spec.node.html(spec.reload_state);
			spec.template = spec.reload_state;
			spec.data = null;
			
			that.node.widgets().each(function(i){
				that.editor_for_node($(this),null);
			});
		
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
				
				$('.monster-icon monster-edit').hide();
				
				var key = node.attr('m:key');
				var id = node.attr('m:id');
				var uri = config.service_location + 'regions/' + id + '/';
				
				$.getJSON(uri,function(data){
					
					var spec = {
						'node': node,
						'data': (data.data) ? $.evalJSON(data.data) : null,
						'revert_state': node.html(),
						'reload_state': node.prev().html(),
						'template': data.template,
						'save_uri': uri,
						'edit_handler': handler 
					};
					
					node.html(data.template);
			
					region_editor(spec);
					
				});
				
				MONSTER.hidekey.disable('h');
			});
		});
	
	
		addHideKey();
		
		$(window).bind('resize', reposition_absolutes);
	
		reposition_absolutes();		
		
		
		
	});

})(jQuery,MONSTER_CONFIG);
