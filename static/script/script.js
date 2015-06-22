$(function(){
	'use strict';

	/* --------------------------------------
	/* Utilities and Helpers
	/* -------------------------------------- */

	var util = {
		appendHTML: function(child, parent){
			$(parent).empty().append(child);
		},
		highlightSelected: function( item ){
			var item = $(item);
			item.siblings(item.tag).andSelf().removeClass( 'current' );
			item.addClass( 'current' );
		},
		wrapTag: function(text, className, tag){
			tag = tag || 'span';
			className = className || '';
			return '<' + tag + ' class="' + className + '">' + text + '</' + tag + '>';
		}
	};


	/* --------------------------------------
	/* UI configuration
	/* -------------------------------------- */

	var config = {
		$el: $('.configure'),
		onChangeTheme: function(e){
			var theme = $(this).data('theme');
			config.setTheme(theme);
			util.highlightSelected(this);
		},
		setTheme: function(theme){
			theme = theme || 'default-dark';
			$('body').attr('data-theme', theme);
			localStorage.setItem('theme', theme);
			util.highlightSelected( config.$el.find('[data-theme="'+ theme +'"]') );
		},
		getTheme: function(){
			var theme = localStorage.getItem('theme');
			return theme;
		},
		bind: function(item){
			config.$el.on('click', '.theme', config.onChangeTheme)
		},
		init: function(){
			config.bind();

			// Check for previous theme in localStorage
			var prevTheme = config.getTheme();
			if (prevTheme) config.setTheme(prevTheme);
		}
	};


	/* --------------------------------------
	/* Plugins
	/* -------------------------------------- */

	var clipboard = {
		$alertElTemplate: _.template('<div class="alert"><i class="<%= iconClass %>"></i> <%= alertLabel %> copied to your clipboard </div>'),
		timerID: '',

		init: function(){
			ZeroClipboard.config({
				swfPath: "static/vendor/ZeroClipboard/ZeroClipboard.swf",
				hoverClass: 'hover'
			});
			var client = new ZeroClipboard( $('[data-action="copy"]') );

			client.on( "ready", function(readyEvent) {

				client.on( "aftercopy", function(e){
					// TODO - clean up this logic. Messy!

					var element = $(e.target);
					var alertContainer = element.siblings('.alert-container');
					var alertElement = $(clipboard.$alertElTemplate({
						alertLabel: element.data('alert-label'),
						iconClass: element.find('i').attr('class')
					}));
					var prevAlert = alertContainer.find('.' + alertElement.attr('class'));

					// Clear out previous alerts if they are still running
					window.clearTimeout(clipboard.timeoutID);
					if(prevAlert.length){
						prevAlert.fadeOut('fast', function(){
							$(this).remove();
						});
					}
					// Display an alert indicating success
					alertContainer.append(alertElement);

					alertElement.fadeIn('fast');
					clipboard.timeoutID = setTimeout(function(){
						alertElement.fadeOut('linear', function(){
							$(this).remove();
						});
					}, 1000);

					// in case we decide to use an <a>
					e.preventDefault;
				});
			});
		}
	};

	var autocomplete = {
		defaults: {
			filterFn: function(strs) {
				return function findMatches(q, cb) {
					var matches, substringRegex;

					// an array that will be populated with substring matches
					matches = [];

					// regex used to determine if a string contains the substring `q`
					substringRegex = new RegExp(q, 'i');

					// iterate through the pool of strings and for any string that
					// contains the substring `q`, add it to the `matches` array
					$.each(strs, function(i, str) {
						if (substringRegex.test(str)) {
							matches.push(str);
						}
					});

					cb(matches);
				};
			},
			handlers: {
				onActive: function(){},
				onClose: function(e){},
				onIdle: function(){},
				onOpen: function(){},
				onRender: function(){},
				onSelect: function(){},
				onChange: function(){}
			},
			opts: {
				highlight: true,
				hint: false,
				minLength:0
			}
		},
		bind: function( item, dataset, handlers ){
			item = $(item);
			dataset = dataset || [];
			handlers = handlers || {};
			$.extend(autocomplete.defaults.handlers, handlers);

			// attach typeahead functionality
			item.typeahead(autocomplete.defaults.opts, {
				name: item.data('category'),
				source: autocomplete.defaults.filterFn(dataset),
				limit: 300 // docs say to put limit in the first config object, but it only worked when I placed it here
			});

			// Attach change handler
			item.on('change', handlers.onChange); // Binding to native change event because at time of writing, typeahead's change event is not working
			item.on('typeahead:active', handlers.onActive);
			item.on('typeahead:close', handlers.onClose);
			item.on('typeahead:open', handlers.onOpen);
			item.on('typeahead:render', handlers.onRender);
			item.on('typeahead:select', handlers.onSelect);
			item.on('typeahead:idle', handlers.onIdle);
		}
	};


	/* --------------------------------------
	/* Models
	/* -------------------------------------- */

	var model = {
		params : {
			product: ['basketball','candlesticks','carrier-pigeon','hairbrush','portable_grill','socks','soda_machine','tweezers','tutu','tea_bags'],
			priority: ['1', '2', '3', '4', '5', '6'],
			application_type: ['individual', 'corporation', 'couple', 'child'],
			id: ['a1a2kk', 'a33kdd', 'aabd33k', 'bbke33','cc9d9c', 'e3f35k', 'f8d8sss'],
			ccy: ['aud','cad','chf','eur','gbp','hkd','jpy','nzd','usd'],
			locale: ['ar_AE','de_DE','el_GR','en_US','es_ES','fr_FR','it_IT','iw_IL','ja_JP','pl_PL','pt_BR','ru_RU','sv_SE','tr_TR','zh_CN','zh_TW'],country: ['afghanistan','albania','algeria','american_samoa','andorra','angola','anguilla','antigua_and_barbuda','argentina','armenia','aruba','austria','azerbaijan','bahamas','bahrain','bangladesh','barbados','belgium','belize','benin','bermuda','bhutan','bolivia','bosnia_and_herzegovina','botswana','british_virgin_islands','brunei','bulgaria','burkina_faso','burundi','cambodia','cameroon','cape_verde_islands','cayman_islands','central_african_republic','chad','chile','china','colombia','comoros','costa_rica','croatia','cyprus','czech_republic','denmark','djibouti','dominica','dominican_republic','ecuador','egypt','el_salvador','equatorial_guinea','eritrea','estonia','ethiopia','falkland_islands','faroe_islands','fiji','finland','france','gabon','gambia','georgia','germany','ghana','gibraltar','greece','greenland','grenada','guam','guatemala','guinea','guinea','guyana','haiti','honduras','hungary','iceland','india','indonesia','iraq','ireland','isle_of_man','israel','italy','jamaica','jordan','kazakhstan','kenya','kiribati','kuwait','kyrgyzstan','laos','latvia','lebanon','lesotho','liechtenstein','lithuania','luxembourg','macao','macedonia','madagascar','malawi','malaysia','maldives','mali','malta','marshall','mauritania','mauritius','mexico','micronesia','moldova','monaco','mongolia','montenegro','morocco','mozambique','namibia','nauru','nepal','netherlands','netherlands_antilles','new_zealand','nicaragua','niger','nigeria','northern_mariana_islands','norway','oman','pakistan','palau','panama','papua_new_guinea','paraguay','peru','philippines','poland','portugal','puerto_rico','qatar','romania','russia','rwanda','saint_kitts_and_nevis','saint_lucia','saint_vincent','samoa','san_marino','sao_tome_and_principe','saudi_arabia','senegal','serbia','seychelles','sierra_leone','slovak_republic','slovenia','solomon_islands','south_africa','spain','sri_lanka','st_helena','suriname','swaziland','sweden','switzerland','taiwan','tajikistan','tanzania','thailand','togo','tonga','trinidad_and_tobago','tunisia','turkey','turkmenistan','turks_and_caicos','tuvalu','uganda','ukraine','united_arab_emirates','united_kingdom','united_states','uruguay','uzbekistan','vanuatu','venezuela','vietnam','virgin_islands_us','yemen','zambia'],
			execution: ['return_first', 'return_last', 'in_first', 'out_first'],
			platform: ['local', 'regional', 'global', 'sub-regional'],
		},

		urlProperties : {
			'environment': {
				qa:	'qa.someenv.com/go/',
				uat: 'uat.someenv.com/go/',
				prod: 'www.production.com/go/'
			},
			'protocol': {
				https: 'https',
				http: 'http'
			}
		}
	};

	var viewModel = (function(){
		var data = {
			params: {
				id: 'a33kdd'
			},
			urlProperties: {
				environment: 'www.production.com/go/',
				protocol: 'https'
			}
		};

		function getOne(type, key) {
			return data && data[type] && data[type][key] || false;
		}

		function getCategory(type, key) {
			return data && data[type] || false;
		}

		function getAll() {
			return data;
		}

		function setValue(type, key, value) {
			if (value === '') {
				delete data[type][key];
			} else {
				data[type][key] = value;
			}
		}

		return {
			getOne: getOne,
			getCategory: getCategory,
			getAll: getAll,
			set: setValue
		};
	}());



	/* --------------------------------------
	/* Views
	/* -------------------------------------- */

	var urlProperties = {
		$el: $('#urlProperties'),
		logElClass: '.log',
		logTemplate: _.template('<strong>URL:</strong> <span class="url"> <%= activeUrl %></span>'),
		timeoutID: '',

		updateLogWithValue: function(value, event){
			var log = $(urlProperties.logElClass);
			var markup = urlProperties.logTemplate({activeUrl: value });

			// Cancel any previous timeouts that may be around
			window.clearTimeout(urlProperties.timeoutID);

			// Update value
			// We're adding a class "hover" if the user is just hovering for a preview and not clicking
			// We also build in a tiny delay on mouseout to prevent flickering when the mouse hovers over a row of buttons
			if (event === 'mouseout') {
				// timeout here
				urlProperties.timeoutID = setTimeout(function(){
					log.removeClass('hover');
					log.html(markup);
				}, 100);
			} else if (event === 'mouseover') {
				log.addClass('hover');
				log.html(markup);
			} else if (event === 'click'){
				log.removeClass('hover');
				log.html(markup);
			}
		},

		onMouseOver: function(element){
			// Preview the value of the button we're hovering over now
			urlProperties.updateLogWithValue($(element).data('value'), 'mouseover');
		},
		onMouseOut: function(element){
			urlProperties.updateLogWithValue($(element).data('value'), 'mouseout');
		},

		onSelect: function(element){
			var category = $(element).attr('data-category');
			var value = $(element).attr('data-value');

			// Update viewModel and view
			util.highlightSelected(element);
			viewModel.set('urlProperties', category, value);
			url.render();

			if (category === 'environment') {
				urlProperties.updateLogWithValue(value, 'click');
			}
		},

		bind: function(){
			urlProperties.$el.on('click', '[data-category="environment"], [data-category="protocol"]', function(e){
				urlProperties.onSelect(this);
				e.preventDefault;
			});

			urlProperties.$el.on('mouseover mouseout', '[data-category="environment"]', function(e){
				switch(e.type){
					case 'mouseover':
						urlProperties.onMouseOver(this);
						break;

					case 'mouseout':
					urlProperties.onMouseOut(this);
						break;
				}
				e.preventDefault;
			});
		},

		init: function(){
			urlProperties.bind();

			var settings = viewModel.getCategory('urlProperties');

			_.each( settings, function(value, category){
				var el = urlProperties.$el.find('.button[data-value="'+ value +'"]');

				util.highlightSelected(el);
			});

			// Set log value on page load
			urlProperties.updateLogWithValue(settings.environment, 'click');
		}
	};


	var params = {
		$el: $('ul#params'),
		$items: $(),
		deleteElClass: '.delete',
		template: _.template('<li><label><%= category %></label> <input type="text" data-category="<%= category %>" value="<%= value %>" /> <div data-action="delete" class="button button-round choose delete"><i class="fa fa-times"></i></div></li>'),

		renderAll: function(data, selected){
			var items = $();

			// render all items and set values if provided
			_.each( data, function(value, category, obj){
				var finalValue = '';
				var el;

				// check if we have a preselected value or not
				if ( _.has(selected, category) ) {
					finalValue = selected[category];
				}

				// append newly-prepared item to set
				items = items.add(params.template({category: category, value: finalValue }));
			});

			params.bindInputs( items );
			return items;
		},

		onUpdate: function(element){
			element = $(element);

			var category = element.attr('data-category');
			var value = element.val();

			// update selected data according to new value
			viewModel.set('params', category, value);

			url.render();
		},

		bindInputs: function( items ){
			items.each(function(){
				params.bindOneInput($(this).find('input'));
			});

			params.$el.on('click', params.deleteElClass, function(e){
				var currentParam = $(e.target).closest('li').find('input');

				// clear the associated input and regenerate the URL
				if (currentParam.typeahead('val') !== ''){
					currentParam.typeahead('val', '');
					params.onUpdate(currentParam);
				}
			});
		},

		bindOneInput: function( item ){
			var data = model.params[item.data('category')];
			var handlers = {
				onActive: function(){},
				onChange: function(e){
					var el = $(e.target);
					params.onUpdate(el);
					$(el).typeahead('close');
				},
				onClose: function(e){
					var el = $(e.target);
					el.removeClass('active').closest('ul').removeClass('autocompleteOpen')
				},
				onIdle: function(){},
				onOpen: function(e){
					var el = $(e.target);
					el.addClass('active').closest('ul').addClass('autocompleteOpen')
				},
				onRender: function(){},
				onSelect: function(e){
					params.onUpdate(e.target);
				}
			};

			autocomplete.bind(item, data, handlers);
		},

		setUpOnLoad: function(){
			var localModel = model.params;
			var queryString = $.deparam(document.location.search);

			// Update the viewModel with any data injected from the queryString
			// Validate all values before updating viewModel
			if(queryString) {
				_.each(queryString, function(value, key, obj){
					if (_.has(localModel, key)){
						viewModel.set('params', key, value);
					} else if (key === 'environment') {
						viewModel.set('urlProperties', 'environment', model.urlProperties.environment[value]);
					} else if (key === 'protocol') {
						viewModel.set('urlProperties', 'protocol', value);
					}
				});

				// TODO - update querystring each time a new value is selected.  Then the actual page url correctly represents state across the session.
			}
		},

		init: function(){
			// prep viewModel - see if we have any injected data to use to build the state
			params.setUpOnLoad();

			// Render the params based on the updated viewModel and append to DOM
			var items = params.renderAll(model.params, viewModel.getCategory('params'));
			util.appendHTML(items, params.$el);
		}
	};

	var url = {
		$el: $('#generated_url'),
		$goLink: $('.url-go'),
		$copyLink: $('.url-copy'),
		$exportLink: $('.url-export'),

		constructText: function(urlParts, pretty) {
			var prettyText = [];
			var protocol = urlParts.protocol;
			var environment = urlParts.environment;
			var params = urlParts.params;

			// protocol
			prettyText.push( util.wrapTag(protocol, 'part') );
			prettyText.push( util.wrapTag('://', 'sep') );

			// environment
			prettyText.push( util.wrapTag(environment, 'part') );
			prettyText.push( util.wrapTag('?', 'sep') );

			// query params
			prettyText.push(url.serializeParams(params, pretty));

			return prettyText.join("");

		},
		serializeParams: function(params, pretty){
			// Returns params either serialized as a valid query param string or wrapped in syntax spans for visual display
			// pretty is a boolean value that when true, wraps the param parts in decorative spans
			var serialized;
			var part = '';

			if (pretty) {
				serialized = [];
				for (var param in params){
					part = util.wrapTag(param, 'param') + util.wrapTag('=', 'eq') + util.wrapTag(params[param], 'param');
					serialized.push(part);
				}
				serialized = serialized.join(util.wrapTag('&', 'sep'));
			} else {
				serialized = $.param(params);
			}
			return serialized;
		},
		render: _.debounce(function(){
			// TODO - this logic has gotten quite messy. Needs a rework!
			// Probably going to be a rework of how the data is stored...
			// Keeping this for now to focus on building out features, but will readdress when I port to backbone.
			var params = viewModel.getCategory('params');
			var protocol = viewModel.getOne('urlProperties', 'protocol');
			var environment = viewModel.getOne( 'urlProperties', 'environment');
			var queryString = '';
			var urlProps = '';

			queryString = $.param(viewModel.getCategory('params'));

			urlProps += '&environment=';
			urlProps += _.findKey(model.urlProperties.environment, function(value, key){ return value === environment;});
			urlProps += '&protocol=';
			urlProps += protocol;

			var href = protocol + '://' + environment + '?' + queryString;
			var anchor = $('<a href="' + href + '">' + url.constructText({params: params, environment: environment, protocol: protocol }, true) + '</a>');

			// ensure export url is clean - no query strings or hashes stowing a ride
			var exportHref = document.location.protocol + '//' + document.location.host + document.location.pathname  + '?' + queryString + urlProps;

			util.appendHTML(anchor, url.$el);
			url.$copyLink.attr('data-clipboard-text', href);
			url.$exportLink.attr('data-clipboard-text', exportHref );
			url.$goLink.attr('href', href);

		}, 200),

		init: function(){
			url.render();
		}
	};


	/* --------------------------------------
	/* Bootstrap
	/* -------------------------------------- */

	var bootstrap = function() {
		params.init();
		urlProperties.init();
		url.init();
		clipboard.init();
		config.init();
	}

	bootstrap();

	// Setup


});
