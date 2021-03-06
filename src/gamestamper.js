if (!window.GSConstants) {
	GSConstants = {
		//get query string parameter with default d for not found
		getParam: function(k,d){
			if (!GSConstants._qp) {
				GSConstants._qp = {};
				var s = location.search.substring(1).split('&');
				for (var j=0;j<s.length;j++) {
					var i = s[j].split('=');
					GSConstants._qp[i[0]]= unescape(i[1]);
				}
			}
			if (!GSConstants._qp[k])
				GSConstants._qp[k] = d;
			return GSConstants._qp[k];
		},
		ensureSlash: function(url) {
			if (url[url.length-1]!='/')url+='/';
			return url;
		}
	}
	GSConstants._isDev = GSConstants.getParam('dev', false);
	GSConstants._defaultDomain = 'gamestamper.com';
	GSConstants._baseDomain= GSConstants.getParam("gswww",GSConstants._defaultDomain).replace(/(http:\/\/|https:\/\/)/,"").replace(/www\./,"");
	GSConstants._baseStaticDomainAndProto= "http://static.gamestamper.com/";
	GSConstants._baseStaticDomainAndProtoSsl= "https://static.gamestamper.com/";
	GSConstants._baseCDDomainAndProto= "http:\/\/static."+(GSConstants._isDev ? "gamestamper":"gamescdn")+".com";
	GSConstants._baseCDDomainAndProtoSsl= "https:\/\/s3.amazonaws.com\/static.gamescdn.com";
	GSConstants._ps= "https";
	GSConstants._wwwDot= "";
	GSConstants._useDebug= GSConstants.getParam('debug', false);
	GSConstants._swf= "sdks/js/XdComm.swf";
	GSConstants._graph= GSConstants.getParam('gsgraph',GSConstants._ps+'://graph.'+GSConstants._baseDomain+'/');
	GSConstants._lstatic= GSConstants.getParam('gsstatic',GSConstants._baseStaticDomainAndProto);
	GSConstants.sizes = {
		borderSize:10,
		apprequests:{
			width:475,
			height:552
		},
		pay:{
			width:400,
			height:157,
			height2:316
		},
		feed:{
			height:266
		}
	};
	GSConstants._fb = 'gs';
}

if (!window.GS) window.GS = {
	_apiKey: null,
	_session: null,
	_userStatus: 'unknown',
	_logging: true,
	_inCanvas: ((window.location.search.indexOf('gs_sig_in_iframe=1') > -1) || (window.location.search.indexOf('session=') > -1) || (window.location.search.indexOf('signed_request=') > -1)  || (window.name.indexOf('iframe_canvas') > -1)),
	_https: (window.name.indexOf('_gs_https') > -1),
	_domain: {
		api: GSConstants.ensureSlash(GSConstants._ps+'://api.'+GSConstants._baseDomain),
		api_read: GSConstants.ensureSlash(GSConstants._ps+'://api-read.'+GSConstants._baseDomain),
		cdn: GSConstants.ensureSlash(GSConstants._baseCDDomainAndProto),
		cdn_foreign: GSConstants.ensureSlash('http://connect.'+GSConstants._baseDomain),
		https_cdn:GSConstants.ensureSlash(GSConstants._baseCDDomainAndProtoSsl),
		graph: GSConstants.ensureSlash(GSConstants._graph),
		staticgs: GSConstants.ensureSlash(GSConstants._baseStaticDomainAndProto),
		https_staticgs: GSConstants.ensureSlash(GSConstants._baseStaticDomainAndProtoSsl),
		www: GSConstants.ensureSlash(window.location.protocol + '//www.'+GSConstants._baseDomain),
		https_www: GSConstants.ensureSlash(GSConstants._ps+'://www.'+GSConstants._baseDomain),
		m: GSConstants.ensureSlash('http://m.'+GSConstants._baseDomain),
		https_m: GSConstants.ensureSlash(GSConstants._ps+'://m.'+GSConstants._baseDomain),
		apps: GSConstants.ensureSlash(GSConstants.getParam('gsapps')),
		def_www: GSConstants.ensureSlash(window.location.protocol + '//www.'+GSConstants._defaultDomain),
		lstatic:GSConstants.ensureSlash(GSConstants._lstatic)
	},
	_locale: null,
	_localeIsRtl: false,
	getDomain: function (a) {
		switch (a) {
			case 'api':
				return GS._domain.api;
			case 'api_read':
				return GS._domain.api_read;
			case 'apps':
				return GS._domain.apps;
			case 'cdn':
				return (window.location.protocol == GSConstants._ps+':' || GS._https) ? GS._domain.https_cdn : GS._domain.cdn;
			case 'cdn_foreign':
				return GS._domain.cdn_foreign;
			case 'https_cdn':
				return GS._domain.https_cdn;
			case 'graph':
				return GS._domain.graph;
			case 'lstatic':
				return GS._domain.lstatic;
			case 'staticgs':
				return GS._https ? GS._domain.https_staticgs : GS._domain.staticgs;
			case 'https_staticgs':
				return GS._domain.https_staticgs;
			case 'www':
				return GS._https ? GS._domain.https_www : GS._domain.www;
			case 'def_www':
				return GS._domain.def_www;
			case 'https_www':
				return GS._domain.https_www;
			case 'm':
				return (window.location.protocol == GSConstants._ps+':' || GS._https) ? GS._domain.https_m : GS._domain.m;
			case 'https_m':
				return GS._domain.https_m;
		}
	},
	copy: function (d, c, b, e) {
		for (var a in c) if (b || typeof d[a] === 'undefined') d[a] = e ? e(c[a]) : c[a];
		return d;
	},
	create: function (c, h) {
		var e = window.GS,
		d = c ? c.split('.') : [],
		a = d.length;
		for (var b = 0; b < a; b++) {
			var g = d[b];
			var f = e[g];
			if (!f) {
				f = (h && b + 1 == a) ? h : {};
				e[g] = f;
			}
			e = f;
		}
		return e;
	},
	provide: function (c, b, a) {
		return GS.copy(typeof c == 'string' ? GS.create(c) : c, b, a);
	},
	guid: function () {
		return 'f' + (Math.random() * (1 << 30)).toString(16).replace('.', '');
	},
	log: function (a) {
		if (!GSConstants.getParam('debug'))
			return;
		if (GS._logging) if (window.Debug && window.Debug.writeln) {
			window.Debug.writeln(a);
		}else if (window.console) {
			var ret = ['gssdk'];
			for (var j=0,l=arguments.length;j<l;j++)
				ret.push(arguments[j]);
			window.console.log(Array.prototype.slice.call(ret));
		}
		if (GS.Event) GS.Event.fire('gs.log', a);
	},
	$id: function (a) {
		return document.getElementById(a);
	}
};
GS.provide('Array', {
	indexOf: function (a, c) {
		if (a.indexOf) return a.indexOf(c);
		var d = a.length;
		if (d) for (var b = 0; b < d; b++) if (a[b] === c) return b;
		return -1;
	},
	merge: function (c, b) {
		for (var a = 0; a < b.length; a++) if (GS.Array.indexOf(c, b[a]) < 0) c.push(b[a]);
		return c;
	},
	filter: function (a, c) {
		var b = [];
		for (var d = 0; d < a.length; d++) if (c(a[d])) b.push(a[d]);
		return b;
	},
	keys: function (c, d) {
		var a = [];
		for (var b in c) if (d || c.hasOwnProperty(b)) a.push(b);
		return a;
	},
	map: function (a, d) {
		var c = [];
		for (var b = 0; b < a.length; b++) c.push(d(a[b]));
		return c;
	},
	forEach: function (c, a, f) {
		if (!c) return;
		if (Object.prototype.toString.apply(c) === '[object Array]' || (!(c instanceof Function) && typeof c.length == 'number')) {
			if (c.forEach) {
				c.forEach(a);
			} else for (var b = 0, e = c.length; b < e; b++) a(c[b], b, c);
		} else for (var d in c) if (f || c.hasOwnProperty(d)) a(c[d], d, c);
	},
	toArray: function (b) {
		for (var c = 0, a = [], d = b.length; c < d; c++) a[c] = b[c];
		return a;
	}
});
GS.provide('QS', {
	encode: function (c, d, a) {
		d = d === undefined ? '&' : d;
		a = a === false ?
		function (e) {
			return e;
		} : encodeURIComponent;
		var b = [];
		GS.Array.forEach(c, function (f, e) {
			if (f !== null && typeof f != 'undefined') b.push(a(e) + '=' + a(f));
		});
		b.sort();
		return b.join(d);
	},
	decode: function (f) {
		var a = decodeURIComponent,
		d = {},
		e = f.split('&'),
		b, c;
		for (b = 0; b < e.length; b++) {
			c = e[b].split('=', 2);
			if (c && c[0]) d[a(c[0])] = a(c[1] || '');
		}
		return d;
	}
});
GS.provide('URI',{
	expression: /(((\w+:)\/\/)([^\/:]*)(:(\d+))?)?([^#?]*)(\?([^#]*))?(#(.*))?/,
	parse: function (uri) {
		var parts = uri.toString().match(GS.URI.expression),
		location = window.location,
		protocol = parts[3] || location.protocol,
		domain = parts[4] || location.hostname;
		return {
			protocol: protocol,
			domain: domain,
			port: parts[6] || '',
			path: parts[7] || '',
			query_s: parts[9] || '',
			fragment: parts[11] || '',
			protocol_and_domain: protocol + '//' + domain,
			full_path: protocol + '//' + domain + parts[7]
		};
	}
});
GS.provide('Content', {
	_root: null,
	_hiddenRoot: null,
	_callbacks: {},
	append: function (a, c) {
		if (!c) if (!GS.Content._root) {
			GS.Content._root = c = GS.$id('gs-root');
			if (!c) {
				var gsroot = document.createElement('div');
				gsroot.id='gs-root';
				document.body.appendChild(gsroot);
				GS.Content._root = c = gsroot;
				return;
			}
			c.className += ' gs_reset';
		}else c = GS.Content._root;
		if (typeof a == 'string') {
			var b = document.createElement('div');
			c.appendChild(b).innerHTML = a;
			return b;
		} else return c.appendChild(a);
	},
	appendHidden: function (a) {
		if (!GS.Content._hiddenRoot) {
			var b = document.createElement('div'),
			c = b.style;
			c.position = 'absolute';
			c.top = '-10000px';
			c.width = c.height = 0;
			GS.Content._hiddenRoot = GS.Content.append(b);
		}
		return GS.Content.append(a, GS.Content._hiddenRoot);
	},
	insertIframe: function (config) {
		config.id = config.id || GS.guid();
		config.name = config.id;
		var initialized = false,
		loaded = false;
		GS.Content._callbacks[config.id] = function () {
			if (initialized && !loaded) {
				loaded = true;
				config.onload && config.onload(config.root.firstChild);
			}
		};
		if (document.attachEvent) {
			var iframe = ('<iframe' + ' id="' + config.id + '"' + ' name="' + config.name + '"'
				+ (config.title ? ' title="' + config.title + '"' : '')
				+ (config.className ? ' class="' + config.className + '"' : '')
				+ ' style="border:none;' + (config.width ? 'width:' + config.width + 'px;' : '')
				+ (config.height ? 'height:' + config.height + 'px;' : '') + '"' + ' src="'
				+ config.url + '"' + ' frameborder="0"' + ' scrolling="no"' + ' allowtransparency="true"'
				+ ' onload="GS.Content._callbacks.' + config.id + '()"' + '></iframe>');
			config.root.innerHTML = '<iframe src="javascript:false"' + ' frameborder="0"' + ' scrolling="no"' + ' style="height:1px"></iframe>';
			initialized = true;
			window.setTimeout(function () {
				config.root.innerHTML = iframe;
				config.onInsert && config.onInsert(config.root.firstChild);
			}, 0);
		} else {
			var iframe = document.createElement('iframe');
			iframe.id = config.id;
			iframe.name = config.name;
			iframe.onload = GS.Content._callbacks[config.id];
			iframe.scrolling = 'no';
			iframe.style.border = 'none';
			iframe.style.overflow = 'hidden';
			if (config.title) iframe.title = config.title;
			if (config.className) iframe.className = config.className;
			if (config.height) iframe.style.height = config.height + 'px';
			if (config.width) iframe.style.width = config.width + 'px';
			config.root.appendChild(iframe);
			initialized = true;
			iframe.src = config.url;
			config.onInsert && config.onInsert(iframe);
		}
	},
	submitToTarget: function (c, b) {
		var a = document.createElement('form');
		a.action = c.url;
		a.target = c.target;
		a.method = (b) ? 'GET' : 'POST';
		GS.Content.appendHidden(a);
		GS.Array.forEach(c.params, function (f, e) {
			if (f !== null && f !== undefined) {
				var d = document.createElement('input');
				d.name = e;
				d.value = f;
				a.appendChild(d);
			}
		});
		a.submit();
		a.parentNode.removeChild(a);
	}
});
GS.provide('Flash', {
	_minVersions: [
		[10, 0, 22, 87]
	],
	_swfPath: GSConstants._swf,
	_callbacks: [],
	_names: {},
	_unloadRegistered: false,
	init: function () {
		if (GS.Flash._init) return;
		GS.Flash._init = true;
		window.GS_OnFlashXdCommReady = function () {
			GS.Flash._ready = true;
			for (var d = 0, e = GS.Flash._callbacks.length; d < e; d++) GS.Flash._callbacks[d]();
			GS.Flash._callbacks = [];
		};
		GS.Flash.embedSWF('XdComm', GS.getDomain('cdn_foreign') + GS.Flash._swfPath);
	},
	embedSWF: function (d, e, b) {
		var a = !! document.attachEvent,
		c = ('<object ' + 'type="application/x-shockwave-flash" ' + 'id="' + d + '" ' + (b ? 'flashvars="' + b + '" ' : '') + (a ? 'name="' + d + '" ' : '') + (a ? '' : 'data="' + e + '" ') + (a ? 'classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" ' : '') + 'allowscriptaccess="always">' + '<param name="movie" value="' + e + '"></param>' + '<param name="allowscriptaccess" value="always"></param>' + '</object>');
		GS.Content.appendHidden(c);
		if (GS.UA.ie() >= 9) {
			if (!GS.Flash._unloadRegistered) {
				var f = function () {
					GS.Array.forEach(GS.Flash._names, function (i, h) {
						var g = document.getElementById(h);
						if (g) g.removeNode(true);
					});
				};
				window.attachEvent('onunload', f);
				GS.Flash._unloadRegistered = true;
			}
			GS.Flash._names[d] = true;
		}
	},
	hasMinVersion: function () {
		if (typeof GS.Flash._hasMinVersion === 'undefined') {
			var i, a, b, h = [];
			if (window.ActiveXObject) {
				try {
					i = new ActiveXObject('ShockwaveFlash.ShockwaveFlash').GetVariable('$version');
				} catch (j) {
				}
			}
			if (!i && navigator.mimeTypes.length > 0) {
				if (navigator.mimeTypes['application/x-shockwave-flash'].enabledPlugin) {
					i = (navigator.plugins['Shockwave Flash 2.0'] || navigator.plugins['Shockwave Flash']).description;
				}
			}
			if (i) {
				var f = i.replace(/\D+/g, ',').match(/^,?(.+),?$/)[1].split(',');
				for (a = 0, b = f.length; a < b; a++) h.push(parseInt(f[a], 10));
			}
			GS.Flash._hasMinVersion = false;
				majorVersion: for (a = 0, b = GS.Flash._minVersions.length; a < b; a++) {
					var g = GS.Flash._minVersions[a];
					if (g[0] != h[0]) continue;
					for (var c = 1, d = g.length, e = h.length;
						(c < d && c < e); c++) if (h[c] < g[c]) {
						GS.Flash._hasMinVersion = false;
						continue majorVersion;
					} else {
						GS.Flash._hasMinVersion = true;
						if (h[c] > g[c]) break majorVersion;
					}
				};
		}
		return GS.Flash._hasMinVersion;
	},
	onReady: function (a) {
		GS.Flash.init();
		if (GS.Flash._ready) {
			window.setTimeout(a, 0);
		} else GS.Flash._callbacks.push(a);
	}
});
if (!this.JSON) this.JSON = {};
(function () {
	function f(n) {
		return n < 10 ? '0' + n : n;
	}
	if (typeof Date.prototype.toJSON !== 'function') {
		Date.prototype.toJSON = function (key) {
			return isFinite(this.valueOf()) ? this.getUTCFullYear() + '-' + f(this.getUTCMonth() + 1) + '-' + f(this.getUTCDate()) + 'T' + f(this.getUTCHours()) + ':' + f(this.getUTCMinutes()) + ':' + f(this.getUTCSeconds()) + 'Z' : null;
		};
		String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function (key) {
			return this.valueOf();
		};
	}
	var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
	escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
	gap, indent, meta = {
		'\b': '\\b',
		'\t': '\\t',
		'\n': '\\n',
		'\f': '\\f',
		'\r': '\\r',
		'"': '\\"',
		'\\': '\\\\'
	},
	rep;

	function quote(string) {
		escapable.lastIndex = 0;
		return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
			var c = meta[a];
			return typeof c === 'string' ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
		}) + '"' : '"' + string + '"';
	}
	function str(key, holder) {
		var i, k, v, length, mind = gap,
		partial, value = holder[key];
		if (value && typeof value === 'object' && typeof value.toJSON === 'function') value = value.toJSON(key);
		if (typeof rep === 'function') value = rep.call(holder, key, value);
		switch (typeof value) {
			case 'string':
				return quote(value);
			case 'number':
				return isFinite(value) ? String(value) : 'null';
			case 'boolean':
			case 'null':
				return String(value);
			case 'object':
				if (!value) return 'null';
				gap += indent;
				partial = [];
				if (Object.prototype.toString.apply(value) === '[object Array]') {
					length = value.length;
					for (i = 0; i < length; i += 1) partial[i] = str(i, value) || 'null';
					v = partial.length === 0 ? '[]' : gap ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' : '[' + partial.join(',') + ']';
					gap = mind;
					return v;
				}
				if (rep && typeof rep === 'object') {
					length = rep.length;
					for (i = 0; i < length; i += 1) {
						k = rep[i];
						if (typeof k === 'string') {
							v = str(k, value);
							if (v) partial.push(quote(k) + (gap ? ': ' : ':') + v);
						}
					}
				} else for (k in value) if (Object.hasOwnProperty.call(value, k)) {
					v = str(k, value);
					if (v) partial.push(quote(k) + (gap ? ': ' : ':') + v);
				}
				v = partial.length === 0 ? '{}' : gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' : '{' + partial.join(',') + '}';
				gap = mind;
				return v;
		}
	}
	if (typeof JSON.stringify !== 'function') JSON.stringify = function (value, replacer, space) {
		var i;
		gap = '';
		indent = '';
		if (typeof space === 'number') {
			for (i = 0; i < space; i += 1) indent += ' ';
		} else if (typeof space === 'string') indent = space;
		rep = replacer;
		if (replacer && typeof replacer !== 'function' && (typeof replacer !== 'object' || typeof replacer.length !== 'number')) throw new Error('JSON.stringify');
		return str('', {
			'': value
		});
	};
	if (typeof JSON.parse !== 'function') JSON.parse = function (text, reviver) {
		var j;

		function walk(holder, key) {
			var k, v, value = holder[key];
			if (value && typeof value === 'object') for (k in value) if (Object.hasOwnProperty.call(value, k)) {
				v = walk(value, k);
				if (v !== undefined) {
					value[k] = v;
				} else delete value[k];
			}
			return reviver.call(holder, key, value);
		}
		cx.lastIndex = 0;
		if (cx.test(text)) text = text.replace(cx, function (a) {
			return '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
		});
		if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
			j = eval('(' + text + ')');
			return typeof reviver === 'function' ? walk({
				'': j
			}, '') : j;
		}
		throw new SyntaxError('JSON.parse');
	};
}());
GS.provide('JSON', {
	stringify: function (a) {
		if (window.Prototype && Object.toJSON) {
			return Object.toJSON(a);
		} else return JSON.stringify(a);
	},
	parse: function (a) {
		return JSON.parse(a);
	},
	flatten: function (c) {
		var a = {};
		for (var b in c) if (c.hasOwnProperty(b)) {
			var d = c[b];
			if (null === d || undefined === d) {
				continue;
			} else if (typeof d == 'string') {
				a[b] = d;
			}else a[b] = GS.JSON.stringify(d);
		}
		return a;
	}
});
GS.provide('', {
	api: function () {
		if (typeof arguments[0] === 'string') {
			GS.ApiServer.graph.apply(GS.ApiServer, arguments);
		} else GS.ApiServer.rest.apply(GS.ApiServer, arguments);
	}
});
GS.provide('ApiServer', {
	METHODS: ['get', 'post', 'delete', 'put'],
	_callbacks: {},
	_readOnlyCalls: {
		fql_query: true,
		fql_multiquery: true,
		friends_get: true,
		notifications_get: true,
		stream_get: true,
		users_getinfo: true
	},
	graph: function () {
		var a = Array.prototype.slice.call(arguments),
		f = a.shift(),
		d = a.shift(),
		c, e, b;
		while (d) {
			var g = typeof d;
			if (g === 'string' && !c) {
				c = d.toLowerCase();
			} else if (g === 'function' && !b) {
				b = d;
			} else if (g === 'object' && !e) {
				e = d;
			} else {
				GS.log('Invalid argument passed to GS.api(): ' + d);
				return;
			}
			d = a.shift();
		}
		c = c || 'get';
		e = e || {};
		if (f[0] === '/') f = f.substr(1);
		if (GS.Array.indexOf(GS.ApiServer.METHODS, c) < 0) {
			GS.log('Invalid method passed to GS.api(): ' + c);
			return;
		}
		GS.ApiServer.oauthRequest('graph', f, c, e, b);
	},
	rest: function (e, a) {
		var c = e.method.toLowerCase().replace('.', '_');
		if (GS.Auth && c === 'auth_revokeauthorization') {
			var d = a;
			a = function (f) {
				if (f === true) if (GS._oauth) {
					GS.Auth.setAuthResponse(null, 'not_authorized');
				} else GS.Auth.setSession(null, 'notConnected');
				d && d(f);
			};
		}
		e.format = 'json-strings';
		e.api_key = GS._apiKey;
		var b = GS.ApiServer._readOnlyCalls[c] ? 'api_read' : 'api';
		GS.ApiServer.oauthRequest(b, 'restserver.php', 'get', e, a);
	},
	oauthRequest: function (b, f, c, e, a) {
		if (!e.access_token && GS.getAccessToken()) e.access_token = GS.getAccessToken();
		e.pretty = 0;
		var d = a;
		a = function (h) {
			if (GS.Auth && h && GS._session && GS._session.access_token == e.access_token && (h.error_code === '190' || (h.error && (h.error === 'invalid_token' || h.error.type === 'OAuthException')))) GS.getLoginStatus(null, true);
			d && d(h);
		};
		try {
			GS.ApiServer.jsonp(b, f, c, GS.JSON.flatten(e), a);
		} catch (g) {
			if (GS.Flash.hasMinVersion()) {
				GS.ApiServer.flash(b, f, c, GS.JSON.flatten(e), a);
			} else throw new Error('Flash is required for this API call.');
		}
	},
	jsonp: function (b, f, d, e, a) {
		var c = GS.guid(),
		g = document.createElement('script');
		if (b === 'graph' && d !== 'get') e.method = d;
		e.callback = 'GS.ApiServer._callbacks.' + c;
		var h = (GS.getDomain(b) + f + (f.indexOf('?') > -1 ? '&' : '?') + GS.QS.encode(e));
		if (h.length > 2000) throw new Error('JSONP only support a maximum of 2000 bytes of input.');
		GS.ApiServer._callbacks[c] = function (i) {
			a && a(i);
			delete GS.ApiServer._callbacks[c];
			g.parentNode.removeChild(g);
		};
		g.src = h;
		document.getElementsByTagName('head')[0].appendChild(g);
	},
	flash: function (b, e, c, d, a) {
		if (!window.GS_OnXdHttpResult) window.GS_OnXdHttpResult = function (g, f) {
			GS.ApiServer._callbacks[g](decodeURIComponent(f));
		};
		GS.Flash.onReady(function () {
			if (b === 'graph') d.suppress_http_code = 1;
			var h = GS.getDomain(b) + e,
			f = GS.QS.encode(d);
			if (c === 'get') {
				if (h.length + f.length > 2000) {
					if (b === 'graph') d.method = 'get';
					c = 'post';
					f = GS.QS.encode(d);
				} else {
					h += (h.indexOf('?') > -1 ? '&' : '?') + f;
					f = '';
				}
			} else if (c !== 'post') {
				if (b === 'graph') d.method = c;
				c = 'post';
				f = GS.QS.encode(d);
			}
			var g = document.XdComm.sendXdHttpRequest(c.toUpperCase(), h, f, null);
			GS.ApiServer._callbacks[g] = function (i) {
				a && a(GS.JSON.parse(i));
				delete GS.ApiServer._callbacks[g];
			};
		});
	}
});
GS.provide('EventProvider', {
	subscribers: function () {
		if (!this._subscribersMap) this._subscribersMap = {};
		return this._subscribersMap;
	},
	subscribe: function (b, a) {
		var c = this.subscribers();
		if (!c[b]) {
			c[b] = [a];
		} else c[b].push(a);
	},
	unsubscribe: function (b, a) {
		var c = this.subscribers()[b];
		GS.Array.forEach(c, function (e, d) {
			if (e == a) c[d] = null;
		});
	},
	monitor: function (d, a) {
		if (!a()) {
			var b = this,
			c = function () {
				if (a.apply(a, arguments)) b.unsubscribe(d, c);
			};
			this.subscribe(d, c);
		}
	},
	clear: function (a) {
		delete this.subscribers()[a];
	},
	fire: function () {
		var a = Array.prototype.slice.call(arguments),
		b = a.shift();
		GS.Array.forEach(this.subscribers()[b], function (c) {
			if (c) c.apply(this, a);
		});
	},
	listen: function (a, event, b) {
		if (a.addEventListener) {
			a.addEventListener(event, b, false);
		} else if (a.attachEvent) a.attachEvent(event, b);
	},
	unlisten: function (a, event, b) {
		if (a.removeEventListener) {
			a.removeEventListener(event, b, false);
		} else if (a.detachEvent) a.detachEvent(event, b);
	}
});
GS.provide('Event', GS.EventProvider);
GS.provide('XD', {
	_origin: null,
	_transport: null,
	_callbacks: {},
	_xdProxyUrl: 'connect/xd_proxy.htm',
	_openerTransport: null,
	_openerOrigin: null,
	_nonOpenerOrigin: null,
	_domains: null,
	init: function (a) {
		if (GS.XD._origin) return;
		var c = GSConstants.getParam('xd','postmessage');
		if (GS.xdDomains) {
			GS.XD._domains = {};
			for (var j=0,l=GS.xdDomains.length;j<l;j++) {
				GS.XD._domains[GS.xdDomains[j]]=1;
			}
		}
		if (window.postMessage && c=="postmessage") {
			GS.XD._origin = (window.location.protocol + '//' + window.location.host + '/' + GS.guid());
			GS.XD.PostMessage.init();
			GS.XD._transport = 'postmessage';
		} else if (!a && GS.Flash.hasMinVersion() && c=="flash") {
			GS.XD._origin = (window.location.protocol + '//' + document.domain + '/' );
			GS.XD.Flash.init();
			GS.XD._transport = 'flash';
		} else {
			GS.XD._transport = 'fragment';
			GS.XD.Fragment._channelUrl = a || window.location.toString();
		}
		var a = !! window.attachEvent;
		if (GS.XD._transport != 'postmessage' && a && window.postMessage) {
			GS.XD._openerTransport = GS.XD._transport;
			GS.XD._openerOrigin = GS.XD._origin;
			GS.XD._nonOpenerOrigin = d;
		}
	},
	resolveRelation: function (b) {
		var g, d, f = b.split('.'),
		e = window;
		for (var a = 0, c = f.length; a < c; a++) {
			g = f[a];
			if (g === 'opener' || g === 'parent' || g === 'top') {
				e = e[g];
			}else if (d = /^frames\[['"]?([a-zA-Z0-9-_]+)['"]?\]$/.exec(g)) {
				e = e.frames[d[1]];
			} else throw new SyntaxError('Malformed id to resolve: ' + b + ', pt: ' + g);
		}
		return e;
	},
	_getXdProxyQuery: function() {
		var s = '';
		var p= '';
		var res = '';
		if (GSConstants._isDev) {
			s= '?';
			res = 'dev=1';
			p = '&';
		}
		if (GSConstants._useDebug) {
			s= '?';
			res += p+'debug=1';
		}
		return s+res;
	},
	handler: function (callback, relation, forever, guid, secure) {
		if (window.location.toString().indexOf(GS.XD.Fragment._magic) > 0) return 'javascript:false;//';
		var xdProxyUrl = GS.getDomain((secure ? 'https_' : '') + 'cdn') +GS.XD._xdProxyUrl+GS.XD._getXdProxyQuery()+'#';
		guid = guid || GS.guid();
		relation = relation || 'opener';
		if (GS.XD._openerTransport) if (f == 'opener') {
			GS.XD._transport = GS.XD._openerTransport;
			GS.XD._origin = GS.XD._openerOrigin;
		} else {
			GS.XD.PostMessage.init();
			GS.XD._transport = 'postmessage';
			GS.XD._origin = GS.XD._nonOpenerOrigin;
		}
		if (GS.XD._transport == 'fragment') {
			xdProxyUrl = GS.XD.Fragment._channelUrl;
			var d = xdProxyUrl.indexOf('#');
			if (d > 0) xdProxyUrl = xdProxyUrl.substr(0, d);
			xdProxyUrl += ((xdProxyUrl.indexOf('?') < 0 ? '?' : '&') + GS.XD.Fragment._magic + '#?=&');
		}
		else if (GS.XD._transport == 'flash') {
			xdProxyUrl+='fc='+GS.XD.Flash.getChannel(relation)+'&';
		}
		GS.XD.subscribe(guid,callback,forever);
		return xdProxyUrl + GS.QS.encode({
			cb: guid,
			origin: GS.XD._origin,
			relation: relation || 'opener',
			transport: GS.XD._transport
		});
	},
	subscribe:function(key,callback,forever){
		GS.log('subscribing method'+(forever ? ' (persistent)':''),key,callback);
		GS.XD._callbacks[key] = GS.XD._callbacks[key] || [];
		GS.XD._callbacks[key].push({
			fn: callback,
			forever: forever
		});
	},
	recv: function (response) {
		if (typeof response == 'string') response = GS.QS.decode(response);
		if (response.params && typeof response.params == 'string') response.params = GS.JSON.parse(response.params);
		var cb = response.cb || response.method,
			callbacks = GS.XD._callbacks[cb];
		delete response.cb;
		if (!callbacks) return;
		for (var j=0,l=callbacks.length;j<l;j++) {
			var callback = callbacks[j];
			GS.log('recv',cb,GS.XD._callbacks,callback);
			if (!callback) continue;
			if (!callback.forever) {
				GS.log('deleting callback '+j+' for '+cb);
				delete GS.XD._callbacks[cb][j];
			}
			callback.fn(response);
		}

	},
	domainAllowed: function(domain) {
		return !GS.XD._domains || GS.XD._domains[domain] || document.domain == domain;
	},
	PostMessage: {
		init: function () {
			var a = GS.XD.PostMessage.onMessage;
			window.addEventListener ? window.addEventListener('message', a, false) : window.attachEvent('onmessage', a);
			GS.XD.PostMaster = this;
		},
		onMessage: function (event) {
			if (GS.XD.domainAllowed(GS.URI.parse(event.origin).domain)) {
				GS.log(event.origin,'allowed in',GS.XD._domains);
				GS.XD.recv(event.data);
			}
			else {
				GS.log(event.origin,'DENIED in',GS.XD._domains);
			}
		},
		send: function(msg,dmn){
			var h = (dmn+ GS.XD._xdProxyUrl +GS.XD._getXdProxyQuery()+'#' + msg),
			g = GS.Content.appendHidden('');
			GS.Content.insertIframe({
				url: h,
				root: g,
				width: 1,
				height: 1,
				onload: function () {
					setTimeout(function () {
						g.parentNode.removeChild(g);
					}, 10);
				}
			});
		}
	},
	WebView: {
		onMessage: function (a, c, b) {
			GS.XD.recv(b);
		}
	},
	Flash: {
		init: function () {
			GS.XD.Flash._canvasChannel = GSConstants.getParam('cv', 'canvas');
			GS.XD.Flash._pageChannel = GSConstants.getParam('pg', 'page');
			GS.XD.Flash._xdpChannel = GSConstants.getParam('xdp', 'xdp');
			GS.Flash.onReady(function () {
				document.XdComm.init('GS.XD.Flash.onMessage',GS.XD.Flash._canvasChannel);
			});
			GS.XD.PostMaster = this;
		},
		onMessage: function (a) {
			GS.XD.recv(decodeURIComponent(a));
		},
		send: function(msg,dmn){
			document.XdComm.send(msg, GS.XD.Flash._pageChannel);
		},
		getChannel: function(relation) {
			if (relation=='parent.parent')
				return GS.XD.Flash._pageChannel;
			return GS.XD.Flash._canvasChannel;
		}
	},
	Fragment: {
		_magic: 'gs_xd_fragment',
		checkAndDispatch: function () {
			var loc = window.location.toString(),
			hash = loc.substr(loc.indexOf('#') + 1),
			pos = loc.indexOf(GS.XD.Fragment._magic);
			if (pos > 0) {
				GS.init = GS.getLoginStatus = GS.api = function () {};
				document.documentElement.style.display = 'none';
				GS.XD.resolveRelation(GS.QS.decode(hash).relation).GS.XD.recv(hash);
			}
		}
	},
	inform: function (method, params, relation) {
		var key = relation=="parent.parent" ? "lstatic" : "staticgs" ;
		if (!relation)
			relation = "parent.parent";
		var dmn = GS.getDomain(key);
		if (location.protocol=='https')
			dmn = dmn.replace('http://','https://');
		params.from = GS.XD._origin;
		var msg = GS.QS.encode({
			method: method,
			params: GS.JSON.stringify(params || {}),
			relation: relation,
			transport: GS.XD._transport,
			origin: GS.getDomain('apps')
		});
		GS.XD.PostMaster.send(msg,dmn);
	}
});
GS.provide('UA', {
	ie: function () {
		return GS.UA._populate() || this._ie;
	},
	firefox: function () {
		return GS.UA._populate() || this._firefox;
	},
	opera: function () {
		return GS.UA._populate() || this._opera;
	},
	safari: function () {
		return GS.UA._populate() || this._safari;
	},
	chrome: function () {
		return GS.UA._populate() || this._chrome;
	},
	windows: function () {
		return GS.UA._populate() || this._windows;
	},
	osx: function () {
		return GS.UA._populate() || this._osx;
	},
	linux: function () {
		return GS.UA._populate() || this._linux;
	},
	ios: function () {
		return GS.UA._populate() || this._ios;
	},
	mobile: function () {
		return false;
	},
	android: function () {
		return GS.UA._populate() || this._android;
	},
	iPad: function () {
		return GS.UA._populate() || this._iPad;
	},
	nativeApp: function () {
		return false;
	},
	_populated: false,
	_populate: function () {
		if (GS.UA._populated) return;
		GS.UA._populated = true;
		var a = /(?:MSIE.(\d+\.\d+))|(?:(?:Firefox|GranParadiso|Iceweasel).(\d+\.\d+))|(?:Opera(?:.+Version.|.)(\d+\.\d+))|(?:AppleWebKit.(\d+(?:\.\d+)?))/.exec(navigator.userAgent);
		var c = /(Mac OS X)|(Windows)|(Linux)/.exec(navigator.userAgent);
		var b = /\b(iPhone|iP[ao]d)/.exec(navigator.userAgent);
		GS.UA._iPad = /\b(iPad)/.exec(navigator.userAgent);
		GS.UA._android = navigator.userAgent.match(/Android/i);
		GS.UA._mobile = b || GS.UA._android || navigator.userAgent.match(/Mobile/i);
		if (a) {
			GS.UA._ie = a[1] ? parseFloat(a[1]) : NaN;
			if (GS.UA._ie >= 8 && !window.HTMLCollection) GS.UA._ie = 7;
			GS.UA._firefox = a[2] ? parseFloat(a[2]) : NaN;
			GS.UA._opera = a[3] ? parseFloat(a[3]) : NaN;
			GS.UA._safari = a[4] ? parseFloat(a[4]) : NaN;
			if (GS.UA._safari) {
				a = /(?:Chrome\/(\d+\.\d+))/.exec(navigator.userAgent);
				GS.UA._chrome = a && a[1] ? parseFloat(a[1]) : NaN;
			} else GS.UA._chrome = NaN;
		} else GS.UA._ie = GS.UA._firefox = GS.UA._opera = GS.UA._chrome = GS.UA._safari = NaN;
		if (c) {
			GS.UA._osx = !! c[1];
			GS.UA._windows = !! c[2];
			GS.UA._linux = !! c[3];
		} else GS.UA._osx = GS.UA._windows = GS.UA._linux = false;
		GS.UA._ios = b;
	}
});
GS.provide('Canvas', {
	_timer: null,
	_lastSize: {},
	_pageInfo: {
		clientWidth: 0,
		clientHeight: 0,
		scrollLeft: 0,
		scrollTop: 0,
		offsetLeft: 0,
		offsetTop: 0
	},
	getPageInfo: function (a) {
		var d = 'top.frames[' + window.name + ']';
		var b = GS.XD.handler(function (e) {
			for (var f in GS.Canvas._pageInfo) if (e[f]) GS.Canvas._pageInfo[f] = e[f] | 0;
			a && a(GS.Canvas._pageInfo);
		}, d, true);
		var c = {
			channelUrl: b,
			frame: window.name
		};
		GS.XD.inform('getPageInfo', c, 'top');
		return GS.Canvas._pageInfo;
	},
	_hideFlashCallback: function (f) {
		var a = window.document.getElementsByTagName('object');
		for (var d = 0; d < a.length; d++) {
			var b = a[d];
			if (b.type != "application/x-shockwave-flash") continue;
			var c = false;
			for (var e = 0; e < b.childNodes.length; e++) if (b.childNodes[e].nodeName == "PARAM" && b.childNodes[e].name == "wmode") if (b.childNodes[e].value != "window" && b.childNodes[e].value != "default") c = true;
			if (!c) if (f.state == 'opened') {
				b._old_visibility = b.style.visibility;
				b.style.visibility = 'hidden';
			} else if (f.state == 'closed') {
				b.style.visibility = b._old_visibility;
				delete b._old_visibility;
			}
		}
	},
	init: function () {
		var b = GS.Dom.getViewportInfo();
		GS.Canvas._pageInfo.clientWidth = b.width;
		GS.Canvas._pageInfo.clientHeight = b.height;
		GS.Canvas.getPageInfo();
		var a = GS.XD.handler(GS.Canvas._hideFlashCallback, 'top.frames[' + window.name + ']', true);
		GS.XD.inform('iframeSetupFlashHiding', {
			channelUrl: a
		});
	},
	setSize: function (e) {
		if (typeof e != "object") e = {};
		var c = 0,
			b = 0;
		e = e || {};
		if (e.width == null || e.height == null) {
			e = GS.copy(e, GS.Canvas._computeContentSize());
			c = 16;
			b = 4;
		}
		e = GS.copy(e, {
			frame: window.name || 'iframe_canvas'
		});
		if (GS.Canvas._lastSize[e.frame]) {
			var d = GS.Canvas._lastSize[e.frame].height;
			var a = e.height - d;
			if (GS.Canvas._lastSize[e.frame].width == e.width && (a <= b && a >= -c)) return false;
			//if (GS.Canvas._lastSize[e.frame].width == e.width && (e.height <= a && (Math.abs(a - e.height) <= 16))) return false;
		}
		GS.Canvas._lastSize[e.frame] = e;
		GS.XD.inform('setSize', e);
		return true;
	},
	scrollTo: function (a, b) {
		GS.XD.inform('scrollTo', {
			frame: window.name || 'iframe_canvas',
			x: a,
			y: b
		});
	},
	setAutoGrow: function (b, a) {
		if (a === undefined && typeof b == "number") {
			a = b;
			b = true;
		}
		if (b === undefined || b) {
			if (GS.Canvas._timer === null) GS.Canvas._timer = window.setInterval(GS.Canvas.setSize, a || 100);
			GS.Canvas.setSize();
		}else if (GS.Canvas._timer !== null) {
			window.clearInterval(GS.Canvas._timer);
			GS.Canvas._timer = null;
		}
	},
	setAutoResize: function (b, a) {
		return GS.Canvas.setAutoGrow(b, a);
	},
	setDoneLoading: function (a) {
		GS.Canvas._passAppTtiMessage(a, 'RecordIframeAppTti');
	},
	stopTimer: function (a) {
		GS.Canvas._passAppTtiMessage(a, 'StopIframeAppTtiTimer');
	},
	setUrlHandler: function (a) {
		var b = GS.XD.handler(a, 'top.frames[' + window.name + ']', true);
		GS.XD.inform('setUrlHandler', b);
		GS.Event.listen(window, 'load', function () {
			GS.XD.inform('setUrlHandler', b);
		});
	},
	startTimer: function () {
		GS.Canvas._passAppTtiMessage(null, 'StartIframeAppTtiTimer');
	},
	_passAppTtiMessage: function (a, c) {
		var b = null;
		if (a) b = GS.XD.handler(a, 'top.frames[' + window.name + ']', false);
		GS.XD.inform(c, {
			frame: window.name || 'iframe_canvas',
			time: (new Date()).getTime(),
			appId: parseInt(GS._apiKey, 10),
			channelUrl: b
		});
	},
	_computeContentSize: function () {
		var a = document.body,
		e = document.documentElement,
		i = 0,
		d = Math.max(a.offsetTop, 0),
		h = Math.max(e.offsetTop, 0),
		c = a.scrollHeight + d,
		b = a.offsetHeight + d,
		g = e.scrollHeight + h,
		f = e.offsetHeight + h;
		bottom = Math.max(c, b, g, f);
		if (a.offsetWidth < a.scrollWidth) {
			i = a.scrollWidth + a.offsetLeft;
		} else GS.Array.forEach(a.childNodes, function (j) {
				var k = j.offsetWidth + j.offsetLeft;
				if (k > i) i = k;
			});
		if (e.clientLeft > 0) i += (e.clientLeft * 2);
		if (e.clientTop > 0) bottom += (e.clientTop * 2);
		return {
			height: bottom,
			width: i
		};
	}
});
GS.provide('Intl', {
	_punctCharClass: ('[' + '.!?' + '\u3002' + '\uFF01' + '\uFF1F' + '\u0964' + '\u2026' + '\u0EAF' + '\u1801' + '\u0E2F' + '\uFF0E' + ']'),
	_endsInPunct: function (a) {
		if (typeof a != 'string') return false;
		return a.match(new RegExp(GS.Intl._punctCharClass + '[' + ')"' + "'" + '\u00BB' + '\u0F3B' + '\u0F3D' + '\u2019' + '\u201D' + '\u203A' + '\u3009' + '\u300B' + '\u300D' + '\u300F' + '\u3011' + '\u3015' + '\u3017' + '\u3019' + '\u301B' + '\u301E' + '\u301F' + '\uFD3F' + '\uFF07' + '\uFF09' + '\uFF3D' + '\s' + ']*$'));
	},
	_tx: function (d, a) {
		if (a !== undefined) if (typeof a != 'object') {
			GS.log('The second arg to GS.Intl._tx() must be an Object for ' + 'tx(' + d + ', ...)');
		} else {
			var c;
			for (var b in a) if (a.hasOwnProperty(b)) {
				if (GS.Intl._endsInPunct(a[b])) {
					c = new RegExp('\{' + b + '\}' + GS.Intl._punctCharClass + '*', 'g');
				} else c = new RegExp('\{' + b + '\}', 'g');
				d = d.replace(c, a[b]);
			}
		}
		return d;
	},
	tx: function (b, a) {
		function c(e, d) {
			void(0);
		}
		if (!GS.Intl._stringTable) return null;
		return GSIntern.Intl._tx(GS.Intl._stringTable[b], a);
	}
});
GS.provide('String', {
	trim: function (a) {
		return a.replace(/^\s*|\s*$/g, '');
	},
	format: function (a) {
		if (!GS.String.format._formatRE) GS.String.format._formatRE = /(\{[^\}^\{]+\})/g;
		var b = arguments;
		return a.replace(GS.String.format._formatRE, function (e, d) {
			var c = parseInt(d.substr(1), 10),
			f = b[c + 1];
			if (f === null || f === undefined) return '';
			return f.toString();
		});
	},
	escapeHTML: function (b) {
		var a = document.createElement('div');
		a.appendChild(document.createTextNode(b));
		return a.innerHTML.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
	},
	quote: function (c) {
		var a = /["\\\x00-\x1f\x7f-\x9f]/g,
		b = {
			'\b': '\\b',
			'\t': '\\t',
			'\n': '\\n',
			'\f': '\\f',
			'\r': '\\r',
			'"': '\\"',
			'\\': '\\\\'
		};
		return a.test(c) ? '"' + c.replace(a, function (d) {
			var e = b[d];
			if (e) return e;
			e = d.charCodeAt();
			return '\\u00' + Math.floor(e / 16).toString(16) + (e % 16).toString(16);
		}) + '"' : '"' + c + '"';
	}
});
GS.provide('Dom', {
	containsCss: function (el, c) {
		var b = ' ' + el.className + ' ';
		return b.indexOf(' ' + c + ' ') >= 0;
	},
	addCss: function (el, c) {
		if (!GS.Dom.containsCss(el, c)) el.className = el.className + ' ' + c;
	},
	scrollTop: function() {
		return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
	},
	resize: function(params) {
		var frame = GS.$id(params.frame);
		if (params.height) {
			GS.Dom.setStyle(frame,'height',params.height+"px");
			GS.Dom.setStyle(frame,'top',(Math.max(parseInt((window.innerHeight - parseInt(params.height)) / 2.5), 5) + GS.Dom.scrollTop())+"px");
		}
		if (params.width) {
			GS.Dom.setStyle(frame,'width',params.width+"px");
		}
	//GS.XD.send()
	},
	removeCss: function (b, a) {
		if (GS.Dom.containsCss(b, a)) {
			b.className = b.className.replace(a, '');
			GS.Dom.removeCss(b, a);
		}
	},
	getByClass: function (b, c) {
		c = c || document.body;
		if (c.getElementsByClassName) return GS.Array.toArray(c.getElementsByClassName(b));
		var a = c.getElementsByTagName('*'),
		    d = [];
		for (var e = 0, f = a.length; e < f; e++) if (this.containsCss(a[e], b)) d[d.length] = a[e];
		return d;
	},
	getStyle: function (a, c) {
		var d = false,
		b = a.style;
		if (a.currentStyle) {
			GS.Array.forEach(c.match(/\-([a-z])/g), function (e) {
				c = c.replace(e, e.substr(1, 1).toUpperCase());
			});
			d = a.currentStyle[c];
		} else {
			GS.Array.forEach(c.match(/[A-Z]/g), function (e) {
				c = c.replace(e, '-' + e.toLowerCase());
			});
			if (window.getComputedStyle) {
				d = document.defaultView.getComputedStyle(a, null).getPropertyValue(c);
				if (c == 'background-position-y' || c == 'background-position-x') if (d == 'top' || d == 'left') d = '0px';
			}
		}
		if (c == 'opacity') {
			if (a.filters && a.filters.alpha) return d;
			return d * 100;
		}
		return d;
	},
	setStyle: function (a, c, d) {
		GS.log('setting style ',a,c,d);
		var b = a.style;
		if (c == 'opacity') {
			if (d >= 100) d = 99.999;
			if (d < 0) d = 0;
			b.opacity = d / 100;
			b.MozOpacity = d / 100;
			b.KhtmlOpacity = d / 100;
			if (a.filters) if (a.filters.alpha == undefined) {
				a.filter = "alpha(opacity=" + d + ")";
			} else a.filters.alpha.opacity = d;
		} else b[c] = d;
	},
	addScript: function (b) {
		var a = document.createElement('script');
		a.type = "text/javascript";
		a.src = b;
		return document.getElementsByTagName('head')[0].appendChild(a);
	},
	addCssRules: function (css, c) {
		if (!GS.Dom._cssRules) GS.Dom._cssRules = {};
		var a = true;
		GS.Array.forEach(c, function (f) {
			if (!(f in GS.Dom._cssRules)) {
				a = false;
				GS.Dom._cssRules[f] = true;
			}
		});
		if (a) return;
		if (!GS.UA.ie()) {
			var d = document.createElement('style');
			d.type = 'text/css';
			d.textContent = css;
			document.getElementsByTagName('head')[0].appendChild(d);
		} else try {
			document.createStyleSheet().cssText = css;
		} catch (b) {
			if (document.styleSheets[0]) document.styleSheets[0].cssText += css;
		}
	},
	getBrowserType: function () {
		if (!GS.Dom._browserType) {
			var d = window.navigator.userAgent.toLowerCase(),
			b = ['msie', 'firefox', 'safari', 'gecko'],
			c = ['ie', 'mozilla', 'safari', 'mozilla'];
			for (var a = 0; a < b.length; a++) if (d.indexOf(b[a]) >= 0) {
				GS.Dom._browserType = c[a];
				break;
			}
		}
		return GS.Dom._browserType;
	},
	isIE: function() {
		return GS.UA.ie();
	},
	getViewportInfo: function () {
		var a = (document.documentElement && document.compatMode == 'CSS1Compat') ? document.documentElement : document.body;
		return {
			scrollTop: a.scrollTop,
			scrollLeft: a.scrollLeft,
			width: self.innerWidth ? self.innerWidth : a.clientWidth,
			height: self.innerHeight ? self.innerHeight : a.clientHeight
		};
	},
	ready: function (a) {
		if (GS.Dom._isReady) {
			a &&  a();
		} else GS.Event.subscribe('dom.ready', a);
	}
});
(function () {
	function domReady() {
		GS.Dom._isReady = true;
		GS.Event.fire('dom.ready');
		GS.Event.clear('dom.ready');
	}
	if (GS.Dom._isReady || document.readyState == 'complete') return domReady();
	if (document.addEventListener) {
		document.addEventListener('DOMContentLoaded', domReady, false);
	} else if (document.attachEvent) document.attachEvent('onreadystatechange', domReady);
	if (GS.UA.ie() && window === top)(function () {
		try {
			document.documentElement.doScroll('left');
		} catch (error) {
			setTimeout(arguments.callee, 0);
			return;
		}
		domReady();
	})();
	var oldonload = window.onload;
	window.onload = function () {
		domReady();
		if (oldonload) if (typeof oldonload == 'string') {
			eval(oldonload);
		} else oldonload();
	};
	GS.XD.subscribe('setSize',function(evt){
		GS.Dom.resize(evt.params);
	},true);
})();
GS.provide('', {
	bind: function () {
		var a = Array.prototype.slice.call(arguments),
		c = a.shift(),
		b = a.shift();
		return function () {
			return c.apply(b, a.concat(Array.prototype.slice.call(arguments)));
		};
	},
	Class: function (b, a, d) {
		if (GS.CLASSES[b]) return GS.CLASSES[b];
		var c = a ||
		function () {};
		c.prototype = d;
		c.prototype.bind = function (e) {
			return GS.bind(e, this);
		};
		c.prototype.constructor = c;
		GS.create(b, c);
		GS.CLASSES[b] = c;
		return c;
	},
	subclass: function (d, b, c, e) {
		if (GS.CLASSES[d]) return GS.CLASSES[d];
		var a = GS.create(b);
		GS.copy(e, a.prototype);
		e._base = a;
		e._callBase = function (g) {
			var f = Array.prototype.slice.call(arguments, 1);
			return a.prototype[g].apply(this, f);
		};
		return GS.Class(d, c ? c : function () {
			if (a.apply) a.apply(this, arguments);
		}, e);
	},
	CLASSES: {}
});
GS.provide('Type', {
	isType: function (a, b) {
		while (a) if (a.constructor === b || a === b) {
			return true;
		} else a = a._base;
		return false;
	}
});
GS.Class('Obj', null, GS.copy({
	setProperty: function (a, b) {
		if (GS.JSON.stringify(b) != GS.JSON.stringify(this[a])) {
			this[a] = b;
			this.fire(a, b);
		}
	}
}, GS.EventProvider));
GS.subclass('Dialog', 'Obj', function (a) {
	this.id = a;
	if (!GS.Dialog._dialogs) {
		GS.Dialog._dialogs = {};
		GS.Dialog._addOrientationHandler();
	}
	GS.Dialog._dialogs[a] = this;
}, {});
GS.provide('Dialog', {
	_dialogs: null,
	_lastYOffset: 0,
	_loaderEl: null,
	_overlayEl: null,
	_stack: [],
	_active: null,
	_popStateListenerOn: false,
	_hideOnPopState: function (a) {
		GS.Dialog.hide(GS.Dialog._stack.pop());
	},
	get: function (a) {
		return GS.Dialog._dialogs[a];
	},
	_findRoot: function (a) {
		while (a) {
			if (GS.Dom.containsCss(a, 'gs_dialog')) return a;
			a = a.parentNode;
		}
	},
	_createWWWLoader: function (a) {
		a = parseInt(a, 10);
		a = a ? a : 460;
		return GS.Dialog.create({
			content: ('<div class="dialog_title">' + '  <a id="gs_dialog_loader_close">' + '    <div class="gs_dialog_close_icon"></div>' + '  </a>' + '  <span>Gamestamper</span>' + '  <div style="clear:both;"></div>' + '</div>' + '<div class="dialog_content"></div>' + '<div class="dialog_footer"></div>'),
			width: a
		});
	},
	_createMobileLoader: function () {
		var a = GS.UA.nativeApp() ? '' : ('<table>' + '  <tbody>' + '    <tr>' + '      <td class="header_left">' + '        <label class="touchable_button">' + '          <input type="submit" value="' + GS.Intl._tx("Cancel") + '"' + '            id="gs_dialog_loader_close"/>' + '        </label>' + '      </td>' + '      <td class="header_center">' + '        <div>' + GS.Intl._tx("Loading...") + '</div>' + '      </td>' + '      <td class="header_right">' + '      </td>' + '    </tr>' + '  </tbody>' + '</table>');
		return GS.Dialog.create({
			classes: 'loading' + (GS.UA.iPad() ? ' centered' : ''),
			content: ('<div class="dialog_header">' + a + '</div>')
		});
	},
	_restoreBodyPosition: function () {
		if (!GS.UA.iPad()) {
			var a = document.getElementsByTagName('body')[0];
			GS.Dom.removeCss(a, 'gs_hidden');
		}
	},
	_showIPadOverlay: function () {
		if (!GS.UA.iPad()) return;
		if (!GS.Dialog._overlayEl) {
			GS.Dialog._overlayEl = document.createElement('div');
			GS.Dialog._overlayEl.setAttribute('id', 'fb_dialog_ipad_overlay');
			GS.Content.append(GS.Dialog._overlayEl, null);
		}
		GS.Dialog._overlayEl.className = '';
	},
	_hideIPadOverlay: function () {
		if (GS.UA.iPad()) GS.Dialog._overlayEl.className = 'hidden';
	},
	showLoader: function (a, c) {
		GS.Dialog._showIPadOverlay();
		if (!GS.Dialog._loaderEl) GS.Dialog._loaderEl = GS.Dialog._findRoot(GS.UA.mobile() ? GS.Dialog._createMobileLoader() : GS.Dialog._createWWWLoader(c));
		if (!a) a = function () {};
		var b = GS.$id('gs_dialog_loader_close');
		GS.Dom.removeCss(b, 'gs_hidden');
		b.onclick = function () {
			GS.Dialog._hideLoader();
			GS.Dialog._restoreBodyPosition();
			GS.Dialog._hideIPadOverlay();
			a();
		};
		GS.Dialog._makeActive(GS.Dialog._loaderEl);
	},
	_hideLoader: function () {
		if (GS.Dialog._loaderEl && GS.Dialog._loaderEl == GS.Dialog._active) GS.Dialog._loaderEl.style.top = '-10000px';
	},
	_makeActive: function (b,config) {
		GS.Dialog._lowerActive();
		var ie = GS.Dom.isIE(),
		a = {
			width: parseInt(b.offsetWidth, 10) + (ie ? 2*GSConstants.sizes.borderSize: 0),
			height: parseInt(b.offsetHeight, 10) + (ie ? 2*GSConstants.sizes.borderSize: 0)
		},
		h = config && config.height ? parseInt(config.height) + 2*GSConstants.sizes.borderSize : a.height,
		w = config && config.width ? parseInt(config.width) + 2*GSConstants.sizes.borderSize : a.width,
		e = GS.Dom.getViewportInfo(),
		c = (e.scrollLeft + (e.width - w) / 2),
		d = (e.scrollTop + (e.height - h) / 2.5);
		b.style.left = (c > 0 ? c : 0) + 'px';
		b.style.top = (d > 0 ? d : 0) + 'px';
		GS.Dialog._active = b;
	},
	_lowerActive: function () {
		if (!GS.Dialog._active) return;
		GS.Dialog._active.style.top = '-10000px';
		GS.Dialog._active = null;
	},
	_removeStacked: function (a) {
		GS.Dialog._stack = GS.Array.filter(GS.Dialog._stack, function (b) {
			return b != a;
		});
	},
	_centerActive: function (i, config) {
		var b = GS.Dialog._active;
		if (!b) return;
		var ie = GS.Dom.isIE();
		var k = GS.Dom.getViewportInfo();
		k.height = config && config.height ? parseInt(config.height) + 2*GSConstants.sizes.borderSize : k.height;
		k.width = config && config.width ? parseInt(config.width) + 2*GSConstants.sizes.borderSize : k.width;
		var l = parseInt(b.offsetWidth, 10) + (ie ? 2*GSConstants.sizes.borderSize: 0),
			c = parseInt(b.offsetHeight, 10) + (ie ? 2*GSConstants.sizes.borderSize: 0),
			d = k.scrollLeft + (k.width - l) / 2,
			f = (k.height - c) / 2.5;
		if (d < f) f = d;
		var e = k.height - c - f,
			j = i.scrollTop - i.offsetTop + (i.clientHeight - c) / 2;
		if (j < f) {
			j = f;
		} else if (j > e) j = e;
		j += k.scrollTop;
		if (GS.UA.mobile()) {
			var h = 100;
			if (GS.UA.iPad()) {
				h += (k.height - c) / 2;
			} else {
				var a = document.getElementsByTagName('body')[0];
				GS.Dom.addCss(a, 'gs_hidden');
				d = 10000;
				j = 10000;
			}
			var g = GS.Dom.getByClass('fb_dialog_padding', b);
			if (g.length) g[0].style.height = h + 'px';
		}
		b.style.left = (d > 0 ? d : 0) + 'px';
		b.style.top = (j > 0 ? j : 0) + 'px';
	},
	_handleOrientationChange: function () {
		if (GS.UA.iPad()) {
			GS.Dialog._centerActive(GS.Canvas.getPageInfo());
		} else for (var a in GS.Dialog._dialogs) if (document.getElementById(a)) document.getElementById(a).style.width = GS.UIServer.getDefaultSize().width + 'px';
	},
	_addOrientationHandler: function () {
		if (!GS.UA.mobile()) return;
		var a = "onorientationchange" in window ? 'orientationchange' : 'resize';
		GS.Event.listen(window, a, GS.Dialog._handleOrientationChange);
	},
	create: function (config) {
		config = config || {};
		if (config.loader)
			GS.Dialog._showLoader(config.onClose, config.loaderWidth);
		var d = document.createElement('div'),
		c = document.createElement('div'),
		className = 'gs_dialog';
		if (config.closeIcon && config.onClose) {
			var closeAnchor = document.createElement('a');
			closeAnchor.className = 'gs_dialog_close_icon';
			closeAnchor.onclick = config.onClose;
			d.appendChild(closeAnchor);
		}
		className += ' ' + (config.classes || '');
		if (GS.UA.ie()) {
			className += ' gs_dialog_legacy';
			GS.Array.forEach(['vert_left', 'vert_right', 'horiz_top', 'horiz_bottom', 'top_left', 'top_right', 'bottom_left', 'bottom_right'], function (g) {
				var h = document.createElement('span');
				h.className = 'gs_dialog_' + g;
				d.appendChild(h);
			});
		} else className += (GS.UA.mobile()) ? ' gs_dialog_mobile' : ' gs_dialog_advanced';
		if (config.content) GS.Content.append(config.content, c);
		d.className = className;
		var width = parseInt(config.width, 10);
		if (!isNaN(width)) d.style.width = width + 'px';
		c.className = 'gs_dialog_content';
		d.appendChild(c);
		if (GS.UA.mobile()) {
			var f = document.createElement('div');
			f.className = 'fb_dialog_padding';
			d.appendChild(f);
		}
		GS.Content.append(d);
		if (config.visible) GS.Dialog.show(d,config);
		return c;
	},
	show: function (a,config) {
		var b = GS.Dialog._findRoot(a);
		if (b) {
			GS.Dialog._removeStacked(b);
			GS.Dialog._hideLoader();
			GS.Dialog._makeActive(b,config);
			GS.Dialog._stack.push(b);
			if ('fbCallID' in a) GS.Dialog.get(a.fbCallID).fire('iframe_show');
			if (!GS.Event._popStateListenerOn) {
				GS.Event.listen(window, 'popstate', GS.Dialog._hideOnPopState);
				GS.Event._popStateListenerOn = true;
			}
		}
	},
	hide: function (a) {
		var b = GS.Dialog._findRoot(a);
		if (b == GS.Dialog._active) {
			GS.Dialog._lowerActive();
			GS.Dialog._restoreBodyPosition();
			GS.Dialog._hideIPadOverlay();
			if ('fbCallID' in a) GS.Dialog.get(a.fbCallID).fire('iframe_hide');
			if (GS.Event._popStateListenerOn) {
				GS.Event.unlisten(window, 'popstate', GS.Dialog._hideOnPopState);
				GS.Event._popStateListenerOn = false;
			}
		}
	},
	remove: function (a) {
		a = GS.Dialog._findRoot(a);
		if (a) {
			var b = GS.Dialog._active == a;
			GS.Dialog._removeStacked(a);
			if (b) {
				GS.Dialog._hideLoader();
				if (GS.Dialog._stack.length > 0) {
					GS.Dialog.show(GS.Dialog._stack.pop());
				} else { 
					GS.Dialog._lowerActive();
					GS.Dialog._restoreBodyPosition();
					GS.Dialog._hideIPadOverlay();
				}
			}
			window.setTimeout(function () {
				a.parentNode.removeChild(a);
			}, 3000);
		}
	},
	isActive: function (a) {
		var b = GS.Dialog._findRoot(a);
		return b && b === GS.Dialog._active;
	}
});
GS.provide('', {
	ui: function (config, b, dmn) {
		if (!config.method) {
			GS.log('"method" is a required parameter for GS.ui().');
			return null;
		}
		if ((config.method == 'permissions.request' || config.method == 'permissions.oauth') && (config.display == 'iframe' || config.display == 'dialog')) {
			var h;
			var i;
			if (GS._oauth) {
				h = config.scope;
				i = h.split(/\s|,/g);
			} else {
				h = config.perms;
				i = h.split(',');
			}
			for (var e = 0; e < i.length; e++) {
				var g = GS.String.trim(i[e]);
				if (g && !GS.initSitevars.iframePermissions[g]) {
					config.display = 'popup';
					break;
				}
			}
		}
		var a = GS.UIServer.prepareCall(config, b, dmn);
		if (!a) return null;
		var d = a.params.display;
		if (d === 'dialog') {
			d = 'iframe';
		} else if (d === 'none') d = 'hidden';
		var c = GS.UIServer[d];
		if (!c) {
			GS.log('"display" must be one of "popup", ' + '"dialog", "iframe", "touch", "async", "hidden", or "none"');
			return null;
		}
		c(a);
		return a.dialog;
	}
});
GS.provide('UIServer', {
	Methods: {},
	_loadedNodes: {},
	_defaultCb: {},
	_resultToken: '"xxRESULTTOKENxx"',
	_forceHTTPS: false,
	genericTransform: function (a) {
		if (a.params.display == 'dialog' || a.params.display == 'iframe') {
			a.params.display = 'iframe';
			a.params.channel = GS.UIServer._xdChannelHandler(a.id, 'parent.parent');
		}
		return a;
	},
	prepareCall: function (config, b, dmn) {
		dmn = dmn || 'def_www';
		var method = config.method.toLowerCase(),
		f =  GS.copy({}, GS.UIServer.Methods[method] || {
			size: {
				width: (GSConstants.sizes[method] && GSConstants.sizes[method].width ? GSConstants.sizes[method].width : 575),
				height: (GSConstants.sizes[method] && GSConstants.sizes[method].height ? GSConstants.sizes[method].height : 240)
			}
		}),
		guid = GS.guid(),
		c = (f.noHttps !== true) && (GS._https || (method !== 'auth.status' && method != 'login.status'));
		GS.UIServer._forceHTTPS = c;
		GS.copy(config, {
			api_key: GS._apiKey,
			app_id: GS._apiKey,
			locale: GS._locale,
			graph: GSConstants._graph,
			gsuser: GSConstants.getParam('gsuser',''),
			access_token: c && GS.getAccessToken() || undefined
		});
		config.display = GS.UIServer.getDisplayMode(f, config);
		if (!f.url) f.url = 'dialog/' + method;
		var a = {
			cb: b,
			id: guid,
			size: f.size || GS.UIServer.getDefaultSize(),
			url: GS.getDomain(dmn) + f.url,
			forceHTTPS: c,
			params: config,
			name: method,
			dialog: new GS.Dialog(guid)
		};
		var j = f.transform ? f.transform : GS.UIServer.genericTransform;
		if (j) {
			a = j(a);
			if (!a) return;
		}
		var d = f.getXdRelation || GS.UIServer.getXdRelation;
		var i = d(a.params);
		if (!(a.id in GS.UIServer._defaultCb) && !('next' in a.params)) a.params.next = GS.UIServer._xdResult(a.cb, a.id, i, true);
		if (i === 'parent') a.params.channel_url = GS.UIServer._xdChannelHandler(guid, 'parent.parent');
		a = GS.UIServer.prepareParams(a);
		return a;
	},
	prepareParams: function (a) {
		var c = a.params.method;
		delete a.params.method;
		if (GS.TemplateUI && GS.TemplateUI.supportsTemplate(c, a)) {
			if (GS.reportTemplates) GS.log("Using template for " + c + ".");
			GS.TemplateUI.useCachedUI(c, a);
		} else {
			a.params = GS.JSON.flatten(a.params);
			var b = GS.QS.encode(a.params);
			if (GS.UIServer.urlTooLongForIE(a.url + b)) {
				a.post = true;
			} else if (b) a.url += '?' + b;
		}
		return a;
	},
	urlTooLongForIE: function (a) {
		return a.length > 2000;
	},
	getDisplayMode: function (a, b) {
		if (b.display === 'hidden' || b.display === 'none') return b.display;
		if (GS.UA.mobile() || b.display === 'touch') return 'touch';
		if (!GS.getAccessToken() && b.display == 'dialog' && !a.loggedOutIframe) {
			GS.log('"dialog" mode can only be used when the user is connected.');
			return 'popup';
		}
		if (a.connectDisplay && !GS._inCanvas) return a.connectDisplay;
		return b.display || (GS.getAccessToken() ? 'dialog' : 'popup');
	},
	getXdRelation: function (b) {
		var a = b.display;
		if (a === 'popup' || a === 'touch') return 'opener';
		if (a === 'dialog' || a === 'iframe' || a === 'hidden' || a === 'none') return 'parent';
		if (a === 'async') return 'parent.frames[' + window.name + ']';
	},
	popup: function (b) {
		var a = typeof window.screenX != 'undefined' ? window.screenX : window.screenLeft,
		i = typeof window.screenY != 'undefined' ? window.screenY : window.screenTop,
		g = typeof window.outerWidth != 'undefined' ? window.outerWidth : document.documentElement.clientWidth,
		f = typeof window.outerHeight != 'undefined' ? window.outerHeight : (document.documentElement.clientHeight - 22),
		k = GS.UA.mobile() ? null : b.size.width,
		d = GS.UA.mobile() ? null : b.size.height,
		h = (a < 0) ? window.screen.width + a : a,
		e = parseInt(h + ((g - k) / 2), 10),
		j = parseInt(i + ((f - d) / 2.5), 10),
		c = [];
		if (k !== null) c.push('width=' + k);
		if (d !== null) c.push('height=' + d);
		c.push('left=' + e);
		c.push('top=' + j);
		c.push('scrollbars=1');
		if (b.name == 'permissions.request' || b.name == 'permissions.oauth') c.push('location=1,toolbar=0');
		c = c.join(',');
		if (b.name && (b.name == 'permissions.request' || b.name == 'permissions.oauth')) c += ',location=1,toolbar=0';
		if (b.post) {
			GS.UIServer.setLoadedNode(b,window.open('about:blank', b.id, c));
			GS.Content.submitToTarget({
				url: b.url,
				target: b.id,
				params: b.params
			});
		} else GS.UIServer.setLoadedNode(b,window.open(b.url, b.id, c));
		if (b.id in GS.UIServer._defaultCb) GS.UIServer._popupMonitor();
	},
	setLoadedNode: function (a, b) {
		GS.UIServer._loadedNodes[a.id] = b;
		if (a.params) b.fbCallID = a.id;
	},
	getLoadedNode: function (a) {
		return GS.UIServer._loadedNodes[a.id];
	},
	hidden: function (a) {
		a.className = 'GS_UI_Hidden';
		a.root = GS.Content.appendHidden('');
		GS.UIServer._insertIframe(a);
	},
	iframe: function (a) {
		a.className = 'GS_UI_Dialog';
		var cfg = {
			onClose: function () {
				GS.UIServer._triggerDefault(a.id);
			},
			loader: false,
			width: a.size.width,
			visible: true,
			loaderWidth: a.size.width,
			closeIcon: true
		};
		if (a.size.height) {
			cfg.height = a.size.height;
		}
		a.root = GS.Dialog.create(cfg);
		//if (!a.hideLoader) GS.Dialog.showLoader(cfg.onClose, a.size.width);
		GS.Dom.addCss(a.root, 'gs_dialog_iframe');
		GS.UIServer._insertIframe(a);
	},
	async: function (a) {
		a.frame = window.name;
		delete a.url;
		delete a.size;
		GS.XD.inform('showDialog', a);
	},
	getDefaultSize: function () {
		if (GS.UA.mobile()) if (GS.UA.iPad()) {
				return {
					width: 500,
					height: 590
				};
		} else {
			var a = window.innerWidth / window.innerHeight > 1.2;
			return {
				width: window.innerWidth,
				height: Math.max(window.innerHeight, (a ? screen.width : screen.height))
			};
		}
		return {
			width: 575,
			height: 240
		};
	},
	_insertIframe: function (config) {
		GS.UIServer._loadedNodes[config.id] = false;
		var registerFrame = function (frame) {
			if (config.id in GS.UIServer._loadedNodes) GS.UIServer.setLoadedNode(config,frame);
		};
		if (config.post) {
			GS.Content.insertIframe({
				url: 'about:blank',
				root: config.root,
				className: config.className,
				width: config.size.width,
				height: config.size.height,
				onInsert: registerFrame,
				onload: function (c) {
					registerFrame(c);
					GS.Content.submitToTarget({
						url: config.url,
						target: c.name,
						params: config.params
					});
				}
			});
		} else GS.Content.insertIframe({
			url: config.url,
			root: config.root,
			className: config.className,
			width: config.size.width,
			height: config.size.height,
			name: config.frameName,
			onload: registerFrame
		});
	},
	_handleOrientationChange: function (b) {
		var a = GS.UIServer._loadedNodes[b];
		if (!a) return;
		a.style.width = GS.UIServer.getDefaultSize().width + 'px';
	},
	_addOrientationHandler: function (b) {
		if (!GS.UA.mobile()) return;
		GS.UIServer._handleOrientationChange(b);
		var a = "onorientationchange" in window ? 'orientationchange' : 'resize';
		window.addEventListener(a, GS.bind(GS.UIServer._handleOrientationChange, null, b));
	},
	_handleResizeMessage: function (b, a) {
		var c = GS.UIServer._loadedNodes[b];
		if (a.height) c.style.height = a.height + 'px';
		if (a.width) c.style.width = a.width + 'px';
		GS.XD.inform('resize.ack', a || {}, 'parent.frames[' + c.name + ']', true);
		if (!GS.Dialog.isActive(c)) GS.Dialog.show(c);
	},
	_triggerDefault: function (a) {
		GS.UIServer._xdRecv({
			frame: a
		}, GS.UIServer._defaultCb[a] ||
		function () {});
	},
	_popupMonitor: function () {
		var a;
		for (var b in GS.UIServer._loadedNodes) if (GS.UIServer._loadedNodes.hasOwnProperty(b) && b in GS.UIServer._defaultCb) {
			var c = GS.UIServer._loadedNodes[b];
			try {
				if (c.tagName) continue;
			} catch (d) {}
			try {
				if (c.closed) {
					GS.UIServer._triggerDefault(b);
				} else a = true;
			} catch (e) {}
		}
		if (a && !GS.UIServer._popupInterval) {
			GS.UIServer._popupInterval = window.setInterval(GS.UIServer._popupMonitor, 100);
		} else if (!a && GS.UIServer._popupInterval) {
			window.clearInterval(GS.UIServer._popupInterval);
			GS.UIServer._popupInterval = null;
		}
	},
	_xdChannelHandler: function (b, relation) {
		var a = (GS.UIServer._forceHTTPS && GS.UA.ie() !== 7);
		return GS.XD.handler(function (d) {
			var e = GS.UIServer._loadedNodes[b];
			if (!e) return;
			if (d.type == 'resize') {
				GS.UIServer._handleResizeMessage(b, d);
			} else if (d.type == 'hide') {
				GS.Dialog.hide(e);
			} else if (d.type == 'rendered') {
				var f = GS.Dialog._findRoot(e);
				GS.Dialog.show(f);
			} else if (d.type == 'fireevent') GS.Event.fire(d.event);
		}, relation, true, null, a);
	},
	_xdNextHandler: function (a, b, d, c) {
		if (c) GS.UIServer._defaultCb[b] = a;
		return GS.XD.handler(function (e) {
			GS.UIServer._xdRecv(e, a);
		}, d) + '&frame=' + b;
	},
	_xdRecv: function (b, a) {
		var c = GS.UIServer._loadedNodes[b.frame];
		try {
			if (GS.Dom.containsCss(c, 'GS_UI_Hidden')) {
				window.setTimeout(function () {
					c.parentNode.parentNode.removeChild(c.parentNode);
				}, 3000);
			} else if (GS.Dom.containsCss(c, 'GS_UI_Dialog')) {
				GS.Dialog.remove(c);
				if (GS.TemplateUI && GS.UA.mobile()) GS.TemplateUI.populateCache();
			}
		} catch (d) {}
		try {
			if (c.close) {
				c.close();
				GS.UIServer._popupCount--;
			}
		} catch (e) {}
		delete GS.UIServer._loadedNodes[b.frame];
		delete GS.UIServer._defaultCb[b.frame];
		a(b);
	},
	_xdResult: function (cb, b, d, c) {
		return (GS.UIServer._xdNextHandler(function (e) {
			cb && cb(e.result && e.result != GS.UIServer._resultToken && GS.JSON.parse(e.result));
		}, b, d, c) + '&result=' + encodeURIComponent(GS.UIServer._resultToken));
	}
});
GS.provide('', {
	getLoginStatus: function (a, b) {
		if (!GS._apiKey) {
			GS.log('GS.getLoginStatus() called before calling GS.init().');
			return;
		}
		if (a) if (!b && GS.Auth._loadState == 'loaded') {
			if (GS._oauth) {
				a({
					status: GS._userStatus,
					authResponse: GS._authResponse
				});
			} else a({
				status: GS._userStatus,
				session: GS._session
			});
			return;
		} else GS.Event.subscribe('GS.loginStatus', a);
		if (!b && GS.Auth._loadState == 'loading') return;
		GS.Auth._loadState = 'loading';
		var c = function (d) {
			GS.Auth._loadState = 'loaded';
			GS.Event.fire('GS.loginStatus', d);
			GS.Event.clear('GS.loginStatus');
		};
		if (GS.UA.mobile() && window.postMessage && window.localStorage) {
			GS.Auth.staticAuthCheck(c);
		} else if (GS._oauth) {
			GS.ui({
				method: 'login.status',
				display: 'none'
			}, c);
		} else GS.ui({
			method: 'auth.status',
			display: 'hidden'
		}, c, 'www');
	},
	getSession: function () {
		if (GS._oauth) throw new Error('GS.getSession incompatible with OAuth2.');
		return GS._session;
	},
	getAuthResponse: function () {
		if (!GS._oauth) throw new Error('getAuthResponse called when OAuth2 support is ' + 'disabled.  Please fix.');
		return GS._authResponse;
	},
	getAccessToken: function () {
		if (GS._oauth) {
			return (GS._authResponse && GS._authResponse.accessToken) || null;
		} else return (GS._session && GS._session.access_token) || null;
	},
	getUserID: function () {
		if (GS._oauth) {
			return GS._userID;
		} else return (GS._session && GS._session.uid) || 0;
	},
	login: function (a, b) {
		if (GS._oauth) {
			if (b && b.perms) throw new Error('OAuth2 specification states that \'perms\' ' + 'should now be called \'scope\'.  Please update.');
			GS.ui(GS.copy({
				method: 'permissions.oauth',
				display: 'popup'
			}, b || {}), a);
		} else GS.ui(GS.copy({
			method: 'permissions.request',
			display: 'popup'
		}, b || {}), a);
	},
	logout: function (a) {
		GS.ui({
			method: 'auth.logout',
			display: 'hidden'
		}, a);
	}
});
GS.provide('Auth', {
	_callbacks: [],
	_xdStorePath: 'xd_localstorage/',
	staticAuthCheck: function (b) {
		var a = GS.getDomain('https_staticgs');
		GS.Content.insertIframe({
			root: GS.Content.appendHidden(''),
			className: 'FB_UI_Hidden',
			url: a + GS.Auth._xdStorePath,
			onload: function (f) {
				var g = frames[f.name];
				var d = GS.guid();
				var e = false;
				var c = function (h) {
					if (!e) {
						e = true;
						GS.Auth._staticAuthHandler(b, h);
					}
				};
				GS.XD.handler(c, 'parent', true, d);
				setTimeout(c, 500);
				g.postMessage(GS.JSON.stringify({
					method: 'getItem',
					params: ['LoginInfo_' + GS._apiKey, true],
					returnCb: d
				}), a);
			}
		});
	},
	_staticAuthHandler: function (b, d) {
		if (d && d.data && d.data.status && d.data.status == 'connected') {
			var c;
			var f = d.data.status;
			if (GS._oauth) {
				var a = d.data.authResponse || null;
				c = GS.Auth.setAuthResponse(a, f);
			} else {
				var e = d.data.session || null;
				c = GS.Auth.setSession(e, f);
			}
			b && b(c);
		} else if (GS._oauth) {
			GS.ui({
				method: 'login.status',
				display: 'none'
			}, b);
		} else GS.ui({
			method: 'auth.status',
			display: 'hidden'
		}, b);
	},
	setSession: function (e, g) {
		if (GS._oauth) throw new Error('GS.Auth.setSession incompatible with OAuth2.');
		var b = !GS._session && e,
		c = GS._session && !e,
		a = GS._session && e && GS._session.uid != e.uid,
		f = b || c || (GS._session && e && GS._session.access_token != e.access_token),
		h = g != GS._userStatus;
		var d = {
			session: e,
			status: g
		};
		GS._session = e;
		GS._userStatus = g;
		if (f && GS.Cookie && GS.Cookie.getEnabled()) GS.Cookie.set(e);
		if (h) GS.Event.fire('auth.statusChange', d);
		if (c || a) GS.Event.fire('auth.logout', d);
		if (b || a) GS.Event.fire('auth.login', d);
		if (f) GS.Event.fire('auth.sessionChange', d);
		if (GS.Auth._refreshTimer) {
			window.clearTimeout(GS.Auth._refreshTimer);
			delete GS.Auth._refreshTimer;
		}
		if (GS.Auth._loadState && e && e.expires) GS.Auth._refreshTimer = window.setTimeout(function () {
			GS.getLoginStatus(null, true);
		}, 1200000);
		return d;
	},
	setAuthResponse: function (a, h) {
		if (!GS._oauth) throw new Error('GS.Auth.setAuthResponse only compatible with OAuth2.');
		var j = 0;
		if (a) if (a.userID) {
			j = a.userID;
		} else if (a.signedRequest) {
			var f = GS.Auth.parseSignedRequest(a.signedRequest);
			if (f && f.user_id) j = f.user_id;
		}
		var d = !GS._userID && a,
		e = GS._userID && !a,
		c = a && GS._userID != j,
		b = d || e || c,
		i = h != GS._userStatus;
		var g = {
			authResponse: a,
			status: h
		};
		GS._authResponse = a;
		GS._userID = j;
		GS._userStatus = h;
		if (e || c) GS.Event.fire('auth.logout', g);
		if (d || c) GS.Event.fire('auth.login', g);
		if (b) GS.Event.fire('auth.authResponseChange', g);
		if (i) GS.Event.fire('auth.statusChange', g);
		if (GS.Auth._refreshTimer) {
			window.clearTimeout(GS.Auth._refreshTimer);
			delete GS.Auth._refreshTimer;
		}
		if (GS.Auth._loadState && a) GS.Auth._refreshTimer = window.setTimeout(function () {
			GS.getLoginStatus(null, true);
		}, 1200000);
		return g;
	},
	xdHandler: function (a, b, f, c, e, d) {
		return GS.UIServer._xdNextHandler(GS.Auth.xdResponseWrapper(a, e, d), b, f, c);
	},
	xdResponseWrapper: function (a, c, b) {
		return function (e) {
			try {
				b = GS.JSON.parse(e.session);
			} catch (i) {}
			if (b) c = 'connected';
			if (e && e.gs_https && !GS._https) GS._https = true;
			var h = GS.Auth.setSession(b || null, c);
			h.perms = e && e.perms || null;
			if (e && e.required_perms && GS.UA.nativeApp()) {
				var g = JSON.parse(e.required_perms);
				var d = [];
				GS.Array.forEach(g, function (k, j) {
					d = d.concat(k);
				});
				var f = d.join(',');
				GS.login(a, {
					perms: f
				});
			} else a && a(h);
		};
	},
	_getSessionOrigin: function () {
		return 1;
	},
	xdNewHandler: function (b, c, d, a) {
		if (!GS._oauth) throw new Error('xdNewHandler should not be invoked unless ' + 'OAuth2 is being used.');
		return GS.UIServer._xdNextHandler(GS.Auth.xdNewResponseWrapper(b, a), c, d, true);
	},
	xdNewResponseWrapper: function (b, a) {
		if (!GS._oauth) throw new Error('xdNewResponseWrapper should not be invoked unless ' + 'OAuth2 is being used.');
		return function (d) {
			if (d.access_token) {
				var e = GS.Auth.parseSignedRequest(d.signed_request);
				a = {
					accessToken: d.access_token,
					userID: e.user_id,
					expiresIn: parseInt(d.expires_in, 10),
					signedRequest: d.signed_request
				};
				GS.Auth.setAuthResponse(a, 'connected');
				if (GS.Cookie.getEnabled()) {
					var c = (new Date()).getTime() + 1000 * a.expiresIn;
					GS.Cookie.setSignedRequestCookie(d.signed_request, c);
				}
			} else if (!GS._authResponse && a) {
				GS.Auth.setAuthResponse(a, 'connected');
			} else {
				var f;
				if (d.error && d.error === 'not_authorized') {
					f = 'not_authorized';
				} else f = 'unknown';
				GS.Auth.setAuthResponse(null, f);
				if (GS.Cookie.getEnabled()) GS.Cookie.clearSignedRequestCookie();
			}
			if (d && d.gs_https && !GS._https) GS._https = true;
			response = {
				authResponse: GS._authResponse,
				status: GS._userStatus
			};
			b && b(response);
		};
	},
	getOrigin: function () {
		if (GS.UA.nativeApp()) {
			return 3;
		} else if (GS._inMobileCanvas) {
			return 2;
		} else return 1;
	},
	parseSignedRequest: function (d) {
		if (!d) return null;
		var a = d.split('.', 2);
		var c = a[1];
		var b = GS.Auth.base64URLDecode(c);
		return GS.JSON.parse(b);
	},
	base64URLDecode: function (j) {
		j = j.replace(/\-/g, '+').replace(/\_/g, '/');
		if (j.length % 4 !== 0) {
			var m = 4 - j.length % 4;
			for (var d = 0; d < m; d++) j = j + '=';
		}
		var k = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
		var l = "";
		var a, b, c = "";
		var e, f, g, h = "";
		for (var i = 0; i < j.length; i += 4) {
			e = k.indexOf(j.charAt(i));
			f = k.indexOf(j.charAt(i + 1));
			g = k.indexOf(j.charAt(i + 2));
			h = k.indexOf(j.charAt(i + 3));
			a = (e << 2) | (f >> 4);
			b = ((f & 15) << 4) | (g >> 2);
			c = ((g & 3) << 6) | h;
			l = l + String.fromCharCode(a);
			if (g != 64) l = l + String.fromCharCode(b);
			if (h != 64) l = l + String.fromCharCode(c);
			a = b = c = "";
			e = f = g = h = "";
		}
		return unescape(l);
	}
});
GS.provide('UIServer.Methods', {
	'permissions.request': {
		size: {
			width: (GS.UA.mobile() ? null : 640),
			height: (GS.UA.mobile() ? null : 241)
		},
		transform: function (a) {
			if (!GS._apiKey) {
				GS.log('GS.login() called before calling GS.init().');
				return;
			}
			if (GS._session && !a.params.perms && !a.params.auth_type) {
				GS.log('GS.login() called when user is already connected.');
				a.cb && a.cb({
					status: GS._userStatus,
					session: GS._session
				});
				return;
			}
			a = GS.UIServer.genericTransform(a);
			a.cb = GS.Auth.xdResponseWrapper(a.cb, GS._userStatus, GS._session);
			a.params.method = 'permissions.request';
			GS.copy(a.params, {
				gsconnect: GS._inCanvas ? 0 : 1,
				return_session: 1,
				session_version: 3
			});
			return a;
		}
	},
	'permissions.oauth': {
		url: 'dialog/oauth',
		size: {
			width: (GS.UA.mobile() ? null : 627),
			height: (GS.UA.mobile() ? null : 326)
		},
		transform: function (a) {
			if (!GS._apiKey) {
				GS.log('GS.login() called before GS.init().');
				return;
			}
			if (GS._authResponse && !a.params.scope) {
				GS.log('GS.login() called when user is already connected.');
				a.cb && a.cb({
					status: GS._userStatus,
					authResponse: GS._authResponse
				});
				return;
			}
			var b = a.cb,
			c = a.id;
			delete a.cb;
			GS.copy(a.params, {
				client_id: GS._apiKey,
				redirect_uri: GS.Auth.xdNewHandler(b, c, 'opener'),
				origin: GS.Auth.getOrigin(),
				response_type: 'token,signed_request'
			});
			return a;
		}
	},
	'auth.logout': {
		url: 'logout.php',
		transform: function (a) {
			if (!GS._apiKey) {
				GS.log('GS.logout() called before calling GS.init().');
			} else if (GS._oauth && !GS._authResponse) {
				GS.log('GS.logout() called without an access token.');
			} else if (!GS._oauth && !GS._session) {
				GS.log('GS.logout() called without a session.');
			} else {
				if (GS._oauth) {
					a.params.next = GS.Auth.xdNewHandler(a.cb, a.id, 'parent');
				} else a.params.next = GS.Auth.xdHandler(a.cb, a.id, 'parent', false, 'unknown');
				return a;
			}
		}
	},
	'auth.status': {
		url: 'extern/login_status.php',
		transform: function (a) {
			var b = a.cb,
			c = a.id,
			d = GS.Auth.xdHandler;
			delete a.cb;
			GS.copy(a.params, {
				no_session: d(b, c, 'parent', false, 'notConnected'),
				no_user: d(b, c, 'parent', false, 'unknown'),
				ok_session: d(b, c, 'parent', false, 'connected'),
				session_version: 3,
				extern: GS._inCanvas ? 0 : 2,
				session_origin: GS.Auth._getSessionOrigin()
			});
			return a;
		}
	},
	'login.status': {
		url: 'dialog/oauth',
		transform: function (a) {
			var b = a.cb,
			c = a.id;
			delete a.cb;
			GS.copy(a.params, {
				client_id: GS._apiKey,
				redirect_uri: GS.Auth.xdNewHandler(b, c, 'parent'),
				origin: GS.Auth.getOrigin(),
				response_type: 'token,signed_request,code'
			});
			return a;
		}
	}
});
GS.provide('CanvasInsights', {
	setDoneLoading: function (a) {
		GS.Canvas.setDoneLoading(a);
	}
});
GS.provide('Cookie', {
	_domain: null,
	_enabled: false,
	setEnabled: function (a) {
		GS.Cookie._enabled = a;
	},
	getEnabled: function () {
		return GS.Cookie._enabled;
	},
	load: function () {
		var a = document.cookie.match('\\bgss_' + GS._apiKey + '="([^;]*)\\b'),
		b;
		if (a) {
			b = GS.QS.decode(a[1]);
			b.expires = parseInt(b.expires, 10);
			GS.Cookie._domain = b.base_domain;
		}
		return b;
	},
	loadSignedRequest: function () {
		var a = document.cookie.match('\\bgssr_' + GS._apiKey + '=([^;]*)\\b');
		if (!a) return null;
		return a[1];
	},
	setSignedRequestCookie: function (b, a) {
		if (!GS._oauth) throw new Error('GS.Cookie.setSignedRequestCookie should only be ' + 'used with OAuth2.');
		if (!b) throw new Error('Value passed to GS.Cookie.setSignedRequestCookie ' + 'was empty.');
		if (!GS.Cookie.getEnabled()) return;
		GS.Cookie.setRaw('gssr_', b, a);
	},
	clearSignedRequestCookie: function () {
		if (!GS._oauth) throw new Error('GS.Cookie.setSignedRequestCookie should only be ' + 'used with OAuth2.');
		if (!GS.Cookie.getEnabled()) return;
		GS.Cookie.setRaw('gssr_', '', 0);
	},
	setRaw: function (c, e, d, a) {
		var b = new Date(d * 1000).toGMTString();
		document.cookie = c + GS._apiKey + '=' + e + (e && d === 0 ? '' : '; expires=' + b) + '; path=/' + (a ? '; domain=.' + a : '');
	},
	set: function (a) {
		if (!a) {
			GS.Cookie.clear();
			return;
		}
		GS.Cookie.setRaw('gss_', '"' + GS.QS.encode(a) + '"', a.expires, a.base_domain);
		GS.Cookie._domain = a.base_domain;
	},
	clear: function () {
		GS.Cookie.setRaw('gss_', '', 0, GS.Cookie._domain);
	}
});
GS.provide('Frictionless', {
	_allowedRecipients: {},
	_useFrictionless: false,
	_updateRecipients: function () {
		GS.Frictionless._allowedRecipients = {};
		GS.api('/me/apprequestformerrecipients', function (a) {
			if (!a || a.error) return;
			GS.Array.forEach(a.data, function (b) {
				GS.Frictionless._allowedRecipients[b.recipient_id] = true;
			}, false);
		});
	},
	init: function () {
		GS.Frictionless._useFrictionless = true;
		GS.getLoginStatus(function (a) {
			if (a.status == 'connected') GS.Frictionless._updateRecipients();
		});
		GS.Event.subscribe('auth.login', function (a) {
			if (a.session) GS.Frictionless._updateRecipients();
		});
	},
	_processRequestResponse: function (a, b) {
		return function (e) {
				var d = e && typeof e.frictionless_value !== 'undefined';
				var f = e && e.updated_frictionless;
				if (GS.Frictionless._useFrictionless && (f || d)) {
					GS.Frictionless._updateRecipients();
					if (d) {
						var c = [];
						GS.Array.forEach(e.request_ids, function (g) {
								c.push(g);
							}, false);
						e.request_ids = c;
					}
				}
				if (e) {
					if (!b && e.frictionless) GS.Dialog._hideLoader();
					delete e.frictionless;
				}
				a && a(e);
			};
		},
	isAllowed: function (c) {
		if (!c) return false;
		if (typeof c === 'number') return GS.Frictionless._allowedRecipients[c];
		if (typeof c === 'string') c = c.split(',');
		c = GS.Array.map(c, GS.String.trim);
		var a = true;
		var b = false;
		GS.Array.forEach(c, function (d) {
			a = a && GS.Frictionless._allowedRecipients[d];
			b = true;
		}, false);
		return a && b;
	}
});
GS.provide('', {
	initSitevars: {},
	init: function (a) {
		a = GS.copy(a || {}, {
			logging: true,
			status: true
		});
		if (a.xfbml) {
			GSConstants._fb = 'fb';
			a.xgsml = a.xfbml;
		}
		GS._userID = 0;
		GS._apiKey = a.appId || a.apiKey;
		GS._oauth = a.oauth;
		if (!a.logging && window.location.toString().indexOf('gs_debug=1') < 0) GS._logging = false;
		GS.XD.init(a.channelUrl);
		if (GS.UA.mobile() && GS.TemplateUI && a.useCachedDialogs !== false) {
			GS.TemplateUI.init();
			GS.Event.subscribe('auth.statusChange', GS.TemplateData.update);
		}
		if (a.reportTemplates) GS.reportTemplates = true;
		if (a.frictionlessRequests) GS.Frictionless.init();
		if (GS._apiKey) {
			GS.Cookie.setEnabled(a.cookie);
			if (GS._oauth) {
				if (a.authResponse) {
					GS.Auth.setAuthResponse(a.authResponse, 'connected');
				} else {
					var c = GS.Cookie.loadSignedRequest();
					var b = GS.Auth.parseSignedRequest(c);
					GS._userID = (b && b.user_id) || 0;
				}
			} else {
				a.session = a.session || GS.Cookie.load();
				GS.Auth.setSession(a.session, a.session ? 'connected' : 'unknown');
			}
			if (a.status) GS.getLoginStatus();
		}
		if (GS._inCanvas) GS.Canvas.init();
		GS.Event.subscribe('xgsml.parse', function () {
			GS.XGSML.IframeWidget.batchWidgetPipeRequests();
		});
		if (a.xgsml) window.setTimeout(function () {
			if (GS.XGSML) if (GS.initSitevars.parseXGSMLBeforeDomReady) {
				GS.XGSML.parse();
				var d = window.setInterval(function () {
					GS.XGSML.parse();
				}, 100);
				GS.Dom.ready(function () {
					window.clearInterval(d);
					GS.XGSML.parse();
				});
			} else GS.Dom.ready(GS.XGSML.parse);
		}, 0);
		if (GS.Canvas && GS.Canvas.Prefetcher) GS.Canvas.Prefetcher._maybeSample();
	}
});
GS.provide('Canvas.Prefetcher', {
	_sampleRate: 0,
	_appIdsBlacklist: [],
	_links: [],
	COLLECT_AUTOMATIC: 0,
	COLLECT_MANUAL: 1,
	_collectionMode: 0,
	addStaticResource: function (a) {
		if (!GS._inCanvas || !GS._apiKey) return;
		GS.Canvas.Prefetcher._links.push(a);
	},
	setCollectionMode: function (a) {
		if (!GS._inCanvas || !GS._apiKey) return false;
		if (a != GS.Canvas.Prefetcher.COLLECT_AUTOMATIC && a != GS.Canvas.Prefetcher.COLLECT_MANUAL) return false;
		GS.Canvas.Prefetcher._collectionMode = a;
	},
	_maybeSample: function () {
		if (!GS._inCanvas || !GS._apiKey || !GS.Canvas.Prefetcher._sampleRate) return;
		if (window.name.indexOf('_gs_https') > -1) return;
		var a = Math.random();
		if (a > 1 / GS.Canvas.Prefetcher._sampleRate) return;
		if (GS.Canvas.Prefetcher._appIdsBlacklist == '*') return;
		if (GS.Array.indexOf(GS.Canvas.Prefetcher._appIdsBlacklist, parseInt(GS._apiKey, 10)) != -1) return;
		window.setTimeout(GS.Canvas.Prefetcher._sample, 30000);
	},
	_sample: function () {
		var b = {
			object: 'data',
			link: 'href',
			script: 'src'
		};
		if (GS.Canvas.Prefetcher._collectionMode == GS.Canvas.Prefetcher.COLLECT_AUTOMATIC) GS.Array.forEach(b, function (c, d) {
			GS.Array.forEach(window.document.getElementsByTagName(d), function (e) {
				if (e[c]) GS.Canvas.Prefetcher._links.push(e[c]);
			});
		});
		var a = GS.JSON.stringify(GS.Canvas.Prefetcher._links);
		GS.api(GS._apiKey + '/staticresources', 'post', {
			urls: a
		});
		GS.Canvas.Prefetcher._links = [];
	}
});
GS.provide('Canvas.EarlyFlush', {
	addResource: function (a) {
		return GS.Canvas.Prefetcher.addStaticResource(a);
	},
	setCollectionMode: function (a) {
		return GS.Canvas.Prefetcher.setCollectionMode(a);
	}
});
GS.provide('CanvasInsights', {
	setDoneLoading: function (a) {
		GS.Canvas.setDoneLoading(a);
	}
});
GS.provide('UIServer.MobileIframableMethod', {
	transform: function (a) {
		if (a.params.display === 'touch' && a.params.access_token && window.postMessage) {
			a.params.channel = GS.UIServer._xdChannelHandler(a.id, 'parent');
			if (!GS.UA.nativeApp()) a.params.in_iframe = 1;
			return a;
		} else return GS.UIServer.genericTransform(a);
	},
	getXdRelation: function (b) {
		var a = b.display;
		if (a === 'touch' && window.postMessage && b.in_iframe) return 'parent';
		return GS.UIServer.getXdRelation(b);
	}
});
GS.provide('UIServer.Methods', {
	'stream.share': {
		size: {
			width: 575,
			height: 380
		},
		url: 'sharer.php',
		transform: function (a) {
			if (!a.params.u) a.params.u = window.location.toString();
			return a;
		}
	},
	'gsml.dialog': {
		size: {
			width: 575,
			height: 300
		},
		url: 'render_gsml.php',
		loggedOutIframe: true,
		transform: function (a) {
			return a;
		}
	},
	'auth.logintofacebook': {
		size: {
			width: 530,
			height: 287
		},
		url: 'login.php',
		transform: function (a) {
			a.params.skip_api_login = 1;
			var c = GS.UIServer.getXdRelation(a.params);
			var b = GS.UIServer._xdResult(a.cb, a.id, c, true);
			a.params.next = GS.getDomain('def_www') + "login.php?" + GS.QS.encode({
				api_key: GS._apiKey,
				next: b,
				skip_api_login: 1
			});
			return a;
		}
	},
	apprequests: {
		transform: function (a) {
			a = GS.UIServer.MobileIframableMethod.transform(a);
			a.params.frictionless = GS.Frictionless && GS.Frictionless._useFrictionless;
			if (a.params.frictionless) {
				a.hideLoader = GS.Frictionless.isAllowed(a.params.to);
				a.cb = GS.Frictionless._processRequestResponse(a.cb, a.hideLoader);
			}
			return a;
		},
		getXdRelation: function (a) {
			return GS.UIServer.MobileIframableMethod.getXdRelation(a);
		}
	},
	feed: GS.UIServer.MobileIframableMethod
});
GS.provide('', {
	share: function (a) {
		GS.log('GS.share() has been deprecated. Please use GS.ui() instead.');
		GS.ui({
			display: 'popup',
			method: 'stream.share',
			u: a
		});
	},
	publish: function (b, a) {
		GS.log('GS.publish() has been deprecated. Please use GS.ui() instead.');
		b = b || {};
		GS.ui(GS.copy({
			display: 'popup',
			method: 'stream.publish',
			preview: 1
		}, b || {}), a);
	},
	addFriend: function (b, a) {
		GS.log('GS.addFriend() has been deprecated. Please use GS.ui() instead.');
		GS.ui({
			display: 'popup',
			id: b,
			method: 'friend.add'
		}, a);
	}
});
GS.UIServer.Methods['auth.login'] = GS.UIServer.Methods['permissions.request'];
GS.provide('XGSML', {
	_renderTimeout: 30000,
	getElements: function (b, f, d) {
		var a = GS.Array,
			e = GS.XGSML._getDomElements(b, f, d),
			c = GS.Dom.getByClass(f + '-' + d, b);
		e = a.toArray(e);
		c = a.toArray(c);
		c = a.filter(c, function (g) {
			return !g.hasChildNodes() || (g.childNodes.length === 1 && g.childNodes[0].nodeType === 3);
		});
		return a.merge(e, c);
	},
	parse: function (d, b) {
		d = d || document.body;
		var c = 1,
		e = function () {
			c--;
			if (c === 0) {
				b && b();
				GS.Event.fire('xgsml.render');
			}
		};
		var a = {};
		if (GS.XGSML._widgetPipeIsEnabled()) GS.Array.forEach(GS.XGSML._tagInfos, function (f) {
			if (f.supportsWidgetPipe) {
				var h = f.xmlns ? f.xmlns : GSConstants._fb;
				var g = GS.XGSML.getElements(d, h, f.localName);
				a[f.localName] = g;
				GS.XGSML._widgetPipeEnabledTagCount += g.length;
			}
		});
		GS.Array.forEach(GS.XGSML._tagInfos, function (g) {
			if (!g.xmlns) g.xmlns = GSConstants._fb;
			var h;
			if (a[g.localName] !== undefined) {
				h = a[g.localName];
			} else h = GS.XGSML.getElements(d, g.xmlns, g.localName);
			for (var f = 0; f < h.length; f++) {
				c++;
				GS.XGSML._processElement(h[f], g, e);
			}
		});
		GS.Event.fire('xgsml.parse');
		window.setTimeout(function () {
			if (c > 0) GS.log(c + ' XGSML tags failed to render in ' + GS.XGSML._renderTimeout + 'ms.');
		}, GS.XGSML._renderTimeout);
		e();
	},
	registerTag: function (a) {
		GS.XGSML._tagInfos.push(a);
	},
	shouldUseWidgetPipe: function () {
		if (!GS.XGSML._widgetPipeIsEnabled()) return false;
		var a = GS.XGSML._widgetPipeEnabledTagCount > 1;
		return a;
	},
	getBoolAttr: function (b, a) {
		a = GS.XGSML.getAttr(b, a);
		return (a && GS.Array.indexOf(['true', '1', 'yes', 'on'], a.toLowerCase()) > -1);
	},
	getAttr: function (b, a) {
		return (b.getAttribute(a) || b.getAttribute(a.replace(/_/g, '-')) || b.getAttribute(a.replace(/-/g, '_')) || b.getAttribute(a.replace(/-/g, '')) || b.getAttribute(a.replace(/_/g, '')) || b.getAttribute('data-' + a) || b.getAttribute('data-' + a.replace(/_/g, '-')) || b.getAttribute('data-' + a.replace(/-/g, '_')) || b.getAttribute('data-' + a.replace(/-/g, '')) || b.getAttribute('data-' + a.replace(/_/g, '')) || null);
	},
	_processElement: function (dom, tagInfo, cb) {
		var element = dom._element;
		if (element) {
			element.subscribe('render', cb);
			element.process();
		} else {
			var processor = function () {
				var fn = eval(tagInfo.className);
				var isLogin = false;
				var showFaces = true;
				var renderInIframe = false;
				var addToTimeline = (tagInfo.className === 'GS.XGSML.AddToTimeline');
				if ((tagInfo.className === 'GS.XGSML.LoginButton') || addToTimeline) {
					renderInIframe = GS.XGSML.getBoolAttr(dom, 'render-in-iframe');
					mode = dom.getAttribute('mode');
					showFaces = (addToTimeline && mode != 'button') || GS.XGSML.getBoolAttr(dom, 'show-faces');
					isLogin = addToTimeline || renderInIframe || showFaces ||  GS.XGSML.getBoolAttr(dom, 'oneclick');
					if (isLogin && !addToTimeline) fn = GS.XGSML.Login;
				}
				element = dom._element = new fn(dom);
				if (isLogin) {
					showFaces = !! showFaces;
					var extraParams = {
						show_faces: showFaces,
						add_to_profile: addToTimeline,
						mode: mode
					};
					var scope = dom.getAttribute('scope');
					if (scope) {
						if (GS._oauth) {
							extraParams.scope = scope;
						} else extraParams.perms = scope;
					} else {
						var perms = dom.getAttribute('perms');
						if (perms) extraParams.perms = perms;
					}
					element.setExtraParams(extraParams);
				}
				element.subscribe('render', cb);
				element.process();
			};
			if (GS.CLASSES[tagInfo.className.substr(3)]) {
				processor();
			} else GS.log('Tag ' + tagInfo.className + ' was not found.');
		}
	},
	_getDomElements: function (a, e, d) {
		var c = e + ':' + d;
		if (GS.UA.firefox()) {
			return a.getElementsByTagNameNS(document.body.namespaceURI, c);
		} else if (GS.UA.ie() < 9) {
			try {
				var docNamespaces = document.namespaces;
				if (docNamespaces && docNamespaces[e]) {
					var nodes = a.getElementsByTagName(d);
					if (!document.addEventListener || nodes.length > 0) return nodes;
				}
			} catch (b) {}
			return a.getElementsByTagName(c);
		} else return a.getElementsByTagName(c);
	},
	_tagInfos: [{
		localName: 'activity',
		className: 'GS.XGSML.Activity'
	}, {
		localName: 'add-profile-tab',
		className: 'GS.XGSML.AddProfileTab'
	}, {
		localName: 'add-to-timeline',
		className: 'GS.XGSML.AddToTimeline'
	}, {
		localName: 'bookmark',
		className: 'GS.XGSML.Bookmark'
	}, {
		localName: 'comments',
		className: 'GS.XGSML.Comments'
	}, {
		localName: 'comments-count',
		className: 'GS.XGSML.CommentsCount'
	}, {
		localName: 'connect-bar',
		className: 'GS.XGSML.ConnectBar'
	}, {
		localName: 'fan',
		className: 'GS.XGSML.Fan'
	}, {
		localName: 'like',
		className: 'GS.XGSML.Like',
		supportsWidgetPipe: true
	}, {
		localName: 'like-box',
		className: 'GS.XGSML.LikeBox'
	}, {
		localName: 'live-stream',
		className: 'GS.XGSML.LiveStream'
	}, {
		localName: 'login',
		className: 'GS.XGSML.Login'
	}, {
		localName: 'login-button',
		className: 'GS.XGSML.LoginButton'
	}, {
		localName: 'facepile',
		className: 'GS.XGSML.Facepile'
	}, {
		localName: 'friendpile',
		className: 'GS.XGSML.Friendpile'
	}, {
		localName: 'name',
		className: 'GS.XGSML.Name'
	}, {
		localName: 'profile-pic',
		className: 'GS.XGSML.ProfilePic'
	}, {
		localName: 'question',
		className: 'GS.XGSML.Question'
	}, {
		localName: 'recommendations',
		className: 'GS.XGSML.Recommendations'
	}, {
		localName: 'recommendations-bar',
		className: 'GS.XGSML.RecommendationsBar'
	}, {
		localName: 'registration',
		className: 'GS.XGSML.Registration'
	}, {
		localName: 'send',
		className: 'GS.XGSML.Send'
	}, {
		localName: 'servergsml',
		className: 'GS.XGSML.ServerGsml'
	}, {
		localName: 'serverfbml',
		className: 'GS.XGSML.ServerGsml'
	}, {
		localName: 'share-button',
		className: 'GS.XGSML.ShareButton'
	}, {
		localName: 'social-bar',
		className: 'GS.XGSML.RecommendationsBar'
	}],
	_widgetPipeEnabledTagCount: 0,
	_widgetPipeIsEnabled: function () {
		return GS.widgetPipeEnabledApps && GS.widgetPipeEnabledApps[GS._apiKey] !== undefined;
	}
});
(function () {
	try {
		if (document.namespaces && !document.namespaces.item.gs) document.namespaces.add('gs');
		if (document.namespaces && !document.namespaces.item.fb) document.namespaces.add('fb');
	} catch (a) {}
}());
GS.provide('XGSML', {
	set: function (b, c, a) {
		GS.log('GS.XGSML.set() has been deprecated.');
		b.innerHTML = c;
		GS.XGSML.parse(b, a);
	}
});
GS.subclass('Waitable', 'Obj', function () {}, {
	set: function (a) {
		this.setProperty('value', a);
	},
	error: function (a) {
		this.fire("error", a);
	},
	wait: function (a, b) {
		if (b) this.subscribe('error', b);
		this.monitor('value', this.bind(function () {
			if (this.value !== undefined) {
				a(this.value);
				return true;
			}
		}));
	}
});
GS.subclass('Data.Query', 'Waitable', function () {
	if (!GS.Data.Query._c) GS.Data.Query._c = 1;
	this.name = 'v_' + GS.Data.Query._c++;
}, {
	parse: function (a) {
		var b = GS.String.format.apply(null, a),
		d = (/^select (.*?) from (\w+)\s+where (.*)$/i).exec(b);
		this.fields = this._toFields(d[1]);
		this.table = d[2];
		this.where = this._parseWhere(d[3]);
		for (var c = 1; c < a.length; c++) if (GS.Type.isType(a[c], GS.Data.Query)) a[c].hasDependency = true;
		return this;
	},
	toFql: function () {
		var a = 'select ' + this.fields.join(',') + ' from ' + this.table + ' where ';
		switch (this.where.type) {
			case 'unknown':
				a += this.where.value;
				break;
			case 'index':
				a += this.where.key + '=' + this._encode(this.where.value);
				break;
			case 'in':
				if (this.where.value.length == 1) {
					a += this.where.key + '=' + this._encode(this.where.value[0]);
				} else a += this.where.key + ' in (' + GS.Array.map(this.where.value, this._encode).join(',') + ')';
				break;
		}
		return a;
	},
	_encode: function (a) {
		return typeof(a) == 'string' ? GS.String.quote(a) : a;
	},
	toString: function () {
		return '#' + this.name;
	},
	_toFields: function (a) {
		return GS.Array.map(a.split(','), GS.String.trim);
	},
	_parseWhere: function (s) {
		var re = (/^\s*(\w+)\s*=\s*(.*)\s*$/i).exec(s),
		result, value, type = 'unknown';
		if (re) {
			value = re[2];
			if (/^(["'])(?:\\?.)*?\1$/.test(value)) {
				value = eval(value);
				type = 'index';
			} else if (/^\d+\.?\d*$/.test(value)) type = 'index';
		}
		if (type == 'index') {
			result = {
				type: 'index',
				key: re[1],
				value: value
			};
		} else result = {
			type: 'unknown',
			value: s
		};
		return result;
	}
});
GS.provide('Data', {
	query: function (c, a) {
		var b = new GS.Data.Query().parse(arguments);
		GS.Data.queue.push(b);
		GS.Data._waitToProcess();
		return b;
	},
	waitOn: function (dependencies, callback) {
		var result = new GS.Waitable(),
		count = dependencies.length;
		if (typeof(callback) == 'string') {
			var s = callback;
			callback = function (args) {
				return eval(s);
			};
		}
		GS.Array.forEach(dependencies, function (item) {
			item.monitor('value', function () {
				var done = false;
				if (GS.Data._getValue(item) !== undefined) {
					count--;
					done = true;
				}
				if (count === 0) {
					var value = callback(GS.Array.map(dependencies, GS.Data._getValue));
					result.set(value !== undefined ? value : true);
				}
				return done;
			});
		});
		return result;
	},
	_getValue: function (a) {
		return GS.Type.isType(a, GS.Waitable) ? a.value : a;
	},
	_selectByIndex: function (a, d, b, e) {
		var c = new GS.Data.Query();
		c.fields = a;
		c.table = d;
		c.where = {
			type: 'index',
			key: b,
			value: e
		};
		GS.Data.queue.push(c);
		GS.Data._waitToProcess();
		return c;
	},
	_waitToProcess: function () {
		if (GS.Data.timer < 0) GS.Data.timer = setTimeout(GS.Data._process, 10);
	},
	_process: function () {
		GS.Data.timer = -1;
		var c = {},
		e = GS.Data.queue;
		GS.Data.queue = [];
		for (var a = 0; a < e.length; a++) {
			var b = e[a];
			if (b.where.type == 'index' && !b.hasDependency) {
				GS.Data._mergeIndexQuery(b, c);
			} else c[b.name] = b;
		}
		var d = {
			method: 'fql.multiquery',
			queries: {}
		};
		GS.copy(d.queries, c, true, function (f) {
			return f.toFql();
		});
		d.queries = GS.JSON.stringify(d.queries);
		GS.api(d, function (f) {
			if (f.error_msg) {
				GS.Array.forEach(c, function (g) {
					g.error(Error(f.error_msg));
				});
			} else GS.Array.forEach(f, function (g) {
				c[g.name].set(g.fql_result_set);
			});
		});
	},
	_mergeIndexQuery: function (a, d) {
		var b = a.where.key,
		f = a.where.value;
		var e = 'index_' + a.table + '_' + b;
		var c = d[e];
		if (!c) {
			c = d[e] = new GS.Data.Query();
			c.fields = [b];
			c.table = a.table;
			c.where = {
				type: 'in',
				key: b,
				value: []
			};
		}
		GS.Array.merge(c.fields, a.fields);
		GS.Array.merge(c.where.value, [f]);
		c.wait(function (g) {
			a.set(GS.Array.filter(g, function (h) {
				return h[b] == f;
			}));
		});
	},
	timer: -1,
	queue: []
});
GS.provide('Tags',{
	parseDataElements: function() {
		var _dataAttributeHandlers = {
			'data-gs-login':
			function(item) {
				item.innerHTML = 'Login';
				item.className+=' gs-login-button';
				var perms = item.attributes.getNamedItem('data-gs-perms'),
				callback = item.attributes.getNamedItem('data-gs-callback');
				perms = perms ? perms.nodeValue : '';
				callback = callback ? callback.nodeValue : null;
				var click = item.onclick;
				item.onclick = function() {
					GS.login(function(response){
						if (callback) {
							var parts = callback.split('.');
							var f = window;
							for (var j=0;j<parts.length;j++) {
								f = f[parts[j]];
							}
							f.call(item,response);
						}
					},{
						perms: perms
					});
					if (click) click.call(item);
					return false;
				}
			}
		};
		var _loadTaggedElementsByType = function (tp) {
			var btns = document.getElementsByTagName(tp);
			var items = {};
			for (var j=0;j<btns.length;j++) {
				for (var atr in _dataAttributeHandlers) {
					items[atr]=[];
					var da = btns[j].attributes.getNamedItem(atr);
					if (da)
						items[atr].push(btns[j]);
				}
			}
			return items;
		};
		var _processElements = function(tp) {
			var items = _loadTaggedElementsByType(tp);
			for (var atr in items) {
				var els = items[atr];
				var action = _dataAttributeHandlers[atr];
				for (var j=0;j<els.length;j++) {
					action(els[j]);
				}
			}
		};
		_processElements('button');
		_processElements('input');
		_processElements('a');
	}
});
GS.provide('', {
	init: function (a) {
		a = GS.copy(a || {}, {
			logging: true,
			status: true
		});
		GS._apiKey = a.appId || a.apiKey;
		if (!a.logging && window.location.toString().indexOf('gs_debug=1') < 0) GS._logging = false;
		if (a.xdDomains) {
			GS.xdDomains = a.xdDomains;
		}
		GS.XD.init(a.channelUrl);
		if (GS._apiKey) {
			GS.Cookie.setEnabled(a.cookie);
			a.session = a.session || GS.Cookie.load();
			GS.Auth.setSession(a.session, a.session ? 'connected' : 'unknown');
			if (a.status) GS.getLoginStatus();
		}
		if (a.xgsml) window.setTimeout(function () {
			if (GS.XGSML) GS.Dom.ready(GS.XGSML.parse);
		}, 0);
		GS.Tags.parseDataElements();
		if (a.onInitComplete)
			GS.Event.subscribe('init.complete', function(a) {
				a.onInitComplete.call(this,a);
			});
		GS.Event.fire('init.complete',a);
	}
});
window.setTimeout(function () {
	var a = /(connect.gamestamper.net|gamestamper.com\/assets.php).*?#(.*)/;
	GS.Array.forEach(document.getElementsByTagName('script'), function (d) {
		if (d.src) {
			var b = a.exec(d.src);
			if (b) {
				var c = GS.QS.decode(b[2]);
				GS.Array.forEach(c, function (f, e) {
					if (f == '0') c[e] = 0;
				});
				GS.init(c);
			}
		}
	});
	if (window.gsAsyncInit && !window.gsAsyncInit.hasRun) {
		window.gsAsyncInit.hasRun = true;
		gsAsyncInit();
	}
}, 0);
GS.provide('UIServer.Methods', {
	'pay.prompt': {
		transform: function (a) {
			var b = GS.XD.handler(function (c) {
				a.cb(GS.JSON.parse(c.response));
			},'parent.frames[' + (window.name || 'iframe_canvas') + ']');
			a.params.channel = b;
			GS.XD.inform('Pay.Prompt', a.params);
			return false;
		}
	},
	'payuiserver': {
		transform: function (a) {
			var b = GS.XD.handler(function (c) {
				a.cb(GS.JSON.parse(c.response));
			}, 'parent.frames[' + (window.name || 'iframe_canvas') + ']');
			a.params.channel = b;
			a.params.uiserver = true;
			GS.XD.inform('Pay.Prompt', a.params);
			return false;
		}
	},
	'pay': {
		transform:function(config){
			var params = config.params,
			paySizes = GSConstants.sizes.pay;

			// json-encode order_info
			params.order_info = GS.JSON.stringify(params.order_info);
			params.channel = GS.XD.handler(function (c) {
				config.cb(GS.JSON.parse(c.response));
			},
			'parent.parent'
			);
			params.origin = GSConstants.getParam('gsapps','http://apps.gamestamper.com');
			if (config.cb) {
				GS.XD.subscribe(config.id,function(params){
					config.cb.call(window,params);
				});
			}

			params.cb = config.id;
			params.width = paySizes.width;
			// if it's  credits purchase, use height2 (taller)
			params.height = paySizes['height' + (params.credits_purchase || (params.dev_purchase_params && !params.dev_purchase_params.oscif) ? '2' : '')];

			// inform the top page that we want the pay dialog
			GS.XD.inform('Pay.Request', params);
			return false;
		}
	}
});
GS.Class('XGSML.Element', function (a) {
	this.dom = a;
}, GS.copy({
	getAttribute: function (b, a, c) {
		var d = GS.XGSML.getAttr(this.dom, b);
		return d ? (c ? c(d) : d) : a;
	},
	_getBoolAttribute: function (b, a) {
		if (GS.XGSML.getAttr(this.dom, b) === null) return a;
		 return GS.XGSML.getBoolAttr(this.dom, b);
	},
	_getPxAttribute: function (b, a) {
		return this.getAttribute(b, a, function (c) {
			var d = parseInt(c.replace('px', ''), 10);
			if (isNaN(d)) {
				return a;
			} else return d;
		});
	},
	_getAttributeFromList: function (c, b, a) {
		return this.getAttribute(c, b, function (d) {
			d = d.toLowerCase();
			if (GS.Array.indexOf(a, d) > -1) {
				return d;
			} else return b;
		});
	},
	isValid: function () {
		for (var a = this.dom; a; a = a.parentNode) if (a == document.body) return true;
	},
	clear: function () {
		this.dom.innerHTML = '';
	}
}, GS.EventProvider));
GS.subclass('XGSML.IframeWidget', 'XGSML.Element', null, {
	_iframeName: null,
	_showLoader: true,
	_refreshOnAuthChange: false,
	_allowReProcess: false,
	_fetchPreCachedLoader: false,
	_visibleAfter: 'load',
	_widgetPipeEnabled: false,
	getUrlBits: function () {
		throw new Error('Inheriting class needs to implement getUrlBits().');
	},
	setupAndValidate: function () {
		return true;
	},
	oneTimeSetup: function () {},
	getSize: function () {},
	getIframeName: function () {
		if (!this._iframeName && this._widgetPipeEnabled && GS.XGSML.shouldUseWidgetPipe()) {
			this._iframeName = this.generateWidgetPipeIframeName();
			GS.XGSML.IframeWidget.allWidgetPipeIframes[this._iframeName] = this;
			if (GS.XGSML.IframeWidget.masterWidgetPipeIframe === null) GS.XGSML.IframeWidget.masterWidgetPipeIframe = this;
		}
		return this._iframeName;
	},
	getIframeTitle: function () {},
	getChannelUrl: function () {
		if (!this._channelUrl) {
			var a = this;
			this._channelUrl = GS.XD.handler(function (b) {
				a.fire('xd.' + b.type, b);
			}, 'parent.parent', true);
		}
		return this._channelUrl;
	},
	getIframeNode: function () {
		return this.dom.getElementsByTagName('iframe')[0];
	},
	arbiterInform: function (event, b, a) {
		if (this.loaded) {
			this._arbiterInform(event, b, a);
		} else this.subscribe('iframe.onload', GS.bind(this._arbiterInform, this, event, b, a));
	},
	_arbiterInform: function (event, b, a) {
		var c = 'parent.frames["' + this.getIframeNode().name + '"]';
		GS.XD.inform(event, b, c, window.location.protocol == 'https:', a);
	},
	getDefaultWebDomain: function () {
		return 'www';
	},
	getDefaultStaticDomain: function () {
		return 'cdn';
	},
	process: function (a) {
		if (this._done) {
			if (!this._allowReProcess && !a) return;
			this.clear();
		} else this._oneTimeSetup();
		this._done = true;
		if (!this.setupAndValidate()) {
			this.fire('render');
			return;
		}
		if (this._showLoader) this._addLoader();
		GS.Dom.addCss(this.dom, 'fb_iframe_widget');
		if (this._visibleAfter != 'immediate') {
			GS.Dom.addCss(this.dom, 'fb_hide_iframes');
		} else this.subscribe('iframe.onload', GS.bind(this.fire, this, 'render'));
		var b = this.getSize() || {};
		var c = this.getFullyQualifiedURL();
		GS.Content.insertIframe({
			url: c,
			root: this.dom.appendChild(document.createElement('span')),
			name: this.getIframeName(),
			title: this.getIframeTitle(),
			className: GS._localeIsRtl ? 'gs_rtl' : 'gs_ltr',
			height: b.height,
			width: b.width,
			onload: GS.bind(this.fire, this, 'iframe.onload')
		});
		this.loaded = false;
		this.subscribe('iframe.onload', GS.bind(function () {
			this.loaded = true;
		}, this));
	},
	generateWidgetPipeIframeName: function () {
		GS.XGSML.IframeWidget.widgetPipeIframeCount++;
		return 'gs_iframe_' + GS.XGSML.IframeWidget.widgetPipeIframeCount;
	},
	getFullyQualifiedURL: function () {
		if (GS.XGSML.shouldUseWidgetPipe() && this._widgetPipeEnabled) return this._getWidgetPipeShell();
		var b = this._getURL();
		if (!this._fetchPreCachedLoader) b += '?' + GS.QS.encode(this._getQS());
		if (b.length > 2000) {
			b = 'about:blank';
			var a = GS.bind(function () {
				this._postRequest();
				this.unsubscribe('iframe.onload', a);
			}, this);
			this.subscribe('iframe.onload', a);
		}
		return b;
	},
	_getWidgetPipeShell: function () {
		return GS.getDomain('www') + 'common/widget_pipe_shell.php';
	},
	_oneTimeSetup: function () {
		this.subscribe('xd.resize', GS.bind(this._handleResizeMsg, this));
		if (GS.getLoginStatus) {
			this.subscribe('xd.refreshLoginStatus', GS.bind(GS.getLoginStatus, GS, function () {}, true));
			this.subscribe('xd.logout', GS.bind(GS.logout, GS, function () {}));
		}
		if (this._refreshOnAuthChange) this._setupAuthRefresh();
		if (this._visibleAfter == 'load') this.subscribe('iframe.onload', GS.bind(this._makeVisible, this));
		this.oneTimeSetup();
	},
	_makeVisible: function () {
		this._removeLoader();
		GS.Dom.removeCss(this.dom, 'fb_hide_iframes');
		this.fire('render');
	},
	_setupAuthRefresh: function () {
		GS.getLoginStatus(GS.bind(function (b) {
			var a = b.status;
			GS.Event.subscribe('auth.statusChange', GS.bind(function (c) {
				if (!this.isValid()) return;
				if (a == 'unknown' || c.status == 'unknown') this.process(true);
				a = c.status;
			}, this));
		}, this));
	},
	_handleResizeMsg: function (b) {
		if (!this.isValid()) return;
		var a = this.getIframeNode();
		a.style.height = b.height + 'px';
		if (b.width) a.style.width = b.width + 'px';
		a.style.border = 'none';
		this._makeVisible();
	},
	_addLoader: function () {
		if (!this._loaderDiv) {
			GS.Dom.addCss(this.dom, 'fb_iframe_widget_loader');
			this._loaderDiv = document.createElement('div');
			this._loaderDiv.className = 'GS_Loader';
			this.dom.appendChild(this._loaderDiv);
		}
	},
	_removeLoader: function () {
		if (this._loaderDiv) {
			GS.Dom.removeCss(this.dom, 'fb_iframe_widget_loader');
			if (this._loaderDiv.parentNode) this._loaderDiv.parentNode.removeChild(this._loaderDiv);
			this._loaderDiv = null;
		}
	},
	_getQS: function () {
		return GS.copy({
			api_key: GS._apiKey,
			locale: GS._locale,
			session_key: GS._session && GS._session.session_key,
			ref: this.getAttribute('ref')
		}, this.getUrlBits().params);
	},
	_getURL: function () {
		var a = 'def_www',
		b = '';
		if (this._fetchPreCachedLoader) {
			a = this.getDefaultStaticDomain();
			b = 'static/';
		}
		return GS.getDomain(a) + 'plugins/' + b + this.getUrlBits().name + '.php';
	},
	_postRequest: function () {
		GS.Content.submitToTarget({
			url: this._getURL(),
			target: this.getIframeNode().name,
			params: this._getQS()
		});
	}
});
GS.provide('XGSML.IframeWidget', {
	widgetPipeIframeCount: 0,
	masterWidgetPipeIframe: null,
	allWidgetPipeIframes: {},
	batchWidgetPipeRequests: function () {
		if (!GS.XGSML.IframeWidget.masterWidgetPipeIframe) return;
		var c = GS.XGSML.IframeWidget._groupWidgetPipeDescriptions();
		var e = {
			widget_pipe: GS.JSON.stringify(c),
			href: window.location,
			site: location.hostname,
			channel: GS.XGSML.IframeWidget.masterWidgetPipeIframe.getChannelUrl(),
			api_key: GS._apiKey,
			locale: GS._locale,
			session_key: GS._session && GS._session.session_key
		};
		var d = GS.guid();
		var a = GS.XGSML.IframeWidget.masterWidgetPipeIframe.dom;
		var b = a.appendChild(document.createElement('span'));
		GS.Content.insertIframe({
			url: 'about:blank',
			root: b,
			name: d,
			className: 'gs_hidden gs_invisible',
			onload: function () {
				GS.Content.submitToTarget({
					url: GS._domain.www + 'widget_pipe.php?widget_pipe=1',
					target: d,
					params: e
				});
			}
		});
	},
	_groupWidgetPipeDescriptions: function () {
		var e = {};
		for (var b in GS.XGSML.IframeWidget.allWidgetPipeIframes) {
			var a = GS.XGSML.IframeWidget.allWidgetPipeIframes[b];
			var c = a.getUrlBits();
			var d = {
				widget: c.name
			};
			GS.copy(d, c.params);
			e[b] = d;
		}
		return e;
	}
});
GS.subclass('XGSML.Activity', 'XGSML.IframeWidget', null, {
	_visibleAfter: 'load',
	_refreshOnAuthChange: true,
	setupAndValidate: function () {
		this._attr = {
			border_color: this.getAttribute('border-color'),
			colorscheme: this.getAttribute('color-scheme'),
			filter: this.getAttribute('filter'),
			action: this.getAttribute('action'),
			max_age: this.getAttribute('max_age'),
			font: this.getAttribute('font'),
			linktarget: this.getAttribute('linktarget', '_blank'),
			header: this._getBoolAttribute('header'),
			height: this._getPxAttribute('height', 300),
			recommendations: this._getBoolAttribute('recommendations'),
			site: this.getAttribute('site', location.hostname),
			width: this._getPxAttribute('width', 300)
		};
		return true;
	},
	getSize: function () {
		return {
			width: this._attr.width,
			height: this._attr.height
		};
	},
	getUrlBits: function () {
		return {
			name: 'activity',
			params: this._attr
		};
	}
});
GS.subclass('XGSML.ButtonElement', 'XGSML.Element', null, {
	_allowedSizes: ['icon', 'small', 'medium', 'large', 'xlarge'],
	onClick: function () {
		throw new Error('Inheriting class needs to implement onClick().');
	},
	setupAndValidate: function () {
		return true;
	},
	getButtonMarkup: function () {
		return this.getOriginalHTML();
	},
	getOriginalHTML: function () {
		return this._originalHTML;
	},
	process: function () {
		if (!('_originalHTML' in this)) this._originalHTML = GS.String.trim(this.dom.innerHTML);
		if (!this.setupAndValidate()) {
			this.fire('render');
			return;
		}
		var d = this._getAttributeFromList('size', 'medium', this._allowedSizes),
		a = '',
		b = '';
		if (d == 'icon') {
			a = 'gs_button_simple';
		} else {
			var c = GS._localeIsRtl ? '_rtl' : '';
			b = this.getButtonMarkup();
			a = 'gs_button' + c + ' gs_button_' + d + c;
		}
		if (b !== '') {
			this.dom.innerHTML = ('<a class="' + a + '">' + '<span class="gs_button_text">' + b + '</span>' + '</a>');
			this.dom.firstChild.onclick = GS.bind(this.onClick, this);
		}
		this.fire('render');
	}
});
GS.provide('Helper', {
	isUser: function (a) {
		return a < 2.2e+09 || (a >= 1e+14 && a <= 100099999989999);
	},
	getLoggedInUser: function () {
		return GS.getUserID();
	},
	upperCaseFirstChar: function (a) {
		if (a.length > 0) {
			return a.substr(0, 1).toUpperCase() + a.substr(1);
		} else return a;
	},
	getProfileLink: function (c, b, a) {
		a = a || (c ? GS.getDomain('www') + 'profile.php?id=' + c.uid : null);
		if (a) b = '<a class="gs_link" href="' + a + '">' + b + '</a>';
		return b;
	},
	invokeHandler: function (handler, scope, args) {
		if (handler) if (typeof handler === 'string') {
			eval(handler);
		} else if (handler.apply) handler.apply(scope, args || []);
	},
	fireEvent: function (a, b) {
		var c = b._attr.href;
		b.fire(a, c);
		GS.Event.fire(a, c, b);
	},
	executeFunctionByName: function (d) {
		var a = Array.prototype.slice.call(arguments, 1);
		var f = d.split(".");
		var c = f.pop();
		var b = window;
		for (var e = 0; e < f.length; e++) b = b[f[e]];
		return b[c].apply(this, a);
	}
});
GS.subclass('XGSML.AddProfileTab', 'XGSML.ButtonElement', null, {
	getButtonMarkup: function () {
		return GS.Intl._tx("Add Profile Tab on GameStamper");
	},
	onClick: function () {
		GS.ui({
			method: 'profile.addtab'
		}, this.bind(function (a) {
			if (a.tab_added) GS.Helper.invokeHandler(this.getAttribute('on-add'), this);
		}));
	}
});
GS.subclass('XGSML.Facepile', 'XGSML.IframeWidget', null, {
    _visibleAfter: 'load',
    _extraParams: {},
    setupAndValidate: function () {
        this._attr = {
            href: this.getAttribute('href'),
            channel: this.getChannelUrl(),
            colorscheme: this.getAttribute('colorscheme', 'light'),
            max_rows: this.getAttribute('max-rows'),
            action: this.getAttribute('action', 'like'),
            tense: this.getAttribute('tense', 'past'),
            width: this._getPxAttribute('width', 200),
            ref: this.getAttribute('ref'),
            size: this.getAttribute('size', 'small'),
            extended_social_context: this.getAttribute('extended_social_context', false),
            login_text: this.dom.innerHTML
        };
        this.clear();
        for (var a in this._extraParams) this._attr[a] = this._extraParams[a];
        return true;
    },
    setExtraParams: function (a) {
        this._extraParams = a;
    },
    oneTimeSetup: function () {
        var a = GS._userStatus;
        GS.Event.subscribe('auth.statusChange', GS.bind(function (b) {
            if (a == 'connected' || b.status == 'connected') this.process(true);
            a = b.status;
        }, this));
    },
    getSize: function () {
        if (this._attr.size == 'large') return {
            width: this._attr.width,
            height: 90
        };
        return {
            width: this._attr.width,
            height: 70
        };
    },
    getUrlBits: function () {
        return {
            name: 'facepile',
            params: this._attr
        };
    }
});
GS.subclass('XGSML.AddToTimeline', 'XGSML.Facepile', null, {
    _visibleAfter: 'load',
    getSize: function () {
        return {
            width: 300,
            height: 250
        };
    },
    getUrlBits: function () {
        return {
            name: 'add_to_timeline',
            params: this._attr
        };
    }
});
GS.subclass('XGSML.Bookmark', 'XGSML.ButtonElement', null, {
	getButtonMarkup: function () {
		return GS.Intl._tx("Bookmark on GameStamper");
	},
	onClick: function () {
		GS.ui({
			method: 'bookmark.add'
		}, this.bind(function (a) {
			if (a.bookmarked) GS.Helper.invokeHandler(this.getAttribute('on-add'), this);
		}));
	}
});
GS.subclass('XGSML.Comments', 'XGSML.IframeWidget', null, {
	_visibleAfter: 'immediate',
	_refreshOnAuthChange: true,
	setupAndValidate: function () {
		var a = {
			channel_url: this.getChannelUrl(),
			colorscheme: this.getAttribute('colorscheme'),
			numposts: this.getAttribute('num-posts', 10),
			width: this._getPxAttribute('width', 550),
			href: this.getAttribute('href'),
			permalink: this.getAttribute('permalink'),
			publish_feed: this.getAttribute('publish_feed')
		};
		if (!a.href) {
			a.migrated = this.getAttribute('migrated');
			a.xid = this.getAttribute('xid');
			a.title = this.getAttribute('title', document.title);
			a.url = this.getAttribute('url', document.URL);
			a.quiet = this.getAttribute('quiet');
			a.reverse = this.getAttribute('reverse');
			a.simple = this.getAttribute('simple');
			a.css = this.getAttribute('css');
			a.notify = this.getAttribute('notify');
			if (!a.xid) {
				var c = document.URL.indexOf('#');
				if (c > 0) {
					a.xid = encodeURIComponent(document.URL.substring(0, c));
				} else a.xid = encodeURIComponent(document.URL);
			}
			if (a.migrated) a.href = 'http://www.facebook.com/plugins/comments_v1.php?' + 'app_id=' + GS._apiKey + '&xid=' + encodeURIComponent(a.xid) + '&url=' + encodeURIComponent(a.url);
		} else {
			var b = this.getAttribute('gs_comment_id');
			if (!b) {
				b = GS.QS.decode(document.URL.substring(document.URL.indexOf('?') + 1)).gs_comment_id;
				if (b && b.indexOf('#') > 0) b = b.substring(0, b.indexOf('#'));
			}
			if (b) {
				a.gs_comment_id = b;
				this.subscribe('render', GS.bind(function () {
					window.location.hash = this.getIframeNode().id;
				}, this));
			}
		}
		this._attr = a;
		return true;
	},
	oneTimeSetup: function () {
		this.subscribe('xd.addComment', GS.bind(this._handleCommentMsg, this));
		this.subscribe('xd.commentCreated', GS.bind(this._handleCommentCreatedMsg, this));
		this.subscribe('xd.commentRemoved', GS.bind(this._handleCommentRemovedMsg, this));
	},
	getSize: function () {
		return {
			width: this._attr.width,
			height: 200
		};
	},
	getUrlBits: function () {
		return {
			name: 'comments',
			params: this._attr
		};
	},
	getDefaultWebDomain: function () {
		return 'https_www';
	},
	_handleCommentMsg: function (a) {
		if (!this.isValid()) return;
		GS.Event.fire('comments.add', {
			post: a.post,
			user: a.user,
			widget: this
		});
	},
	_handleCommentCreatedMsg: function (b) {
		if (!this.isValid()) return;
		var a = {
			href: b.href,
			commentID: b.commentID,
			parentCommentID: b.parentCommentID
		};
		GS.Event.fire('comment.create', a);
	},
	_handleCommentRemovedMsg: function (b) {
		if (!this.isValid()) return;
		var a = {
			href: b.href,
			commentID: b.commentID
		};
		GS.Event.fire('comment.remove', a);
	}
});
GS.subclass('XGSML.CommentsCount', 'XGSML.Element', null, {
	process: function () {
		this._href = this.getAttribute('href', window.location.href);
		this._count = GS.Data._selectByIndex(['commentsbox_count'], 'link_stat', 'url', this._href);
		GS.Dom.addCss(this.dom, 'gs_comments_count_zero');
		this._count.wait(GS.bind(function () {
			var a = this._count.value[0].commentsbox_count;
			this.dom.innerHTML = GS.String.format('<span class="gs_comments_count">{0}</span>', a);
			if (a > 0) GS.Dom.removeCss(this.dom, 'gs_comments_count_zero');
			this.fire('render');
		}, this));
	}
});
GS.provide('Anim', {
	ate: function (c, g, d, b) {
		d = !isNaN(parseFloat(d)) && d >= 0 ? d : 750;
		var e = 40,
		f = {},
		j = {},
		a = null,
		h = c.style,
		i = setInterval(GS.bind(function () {
			if (!a) a = new Date().getTime();
			var k = 1;
			if (d != 0) k = Math.min((new Date().getTime() - a) / d, 1);
			GS.Array.forEach(g, GS.bind(function (o, m) {
				if (!f[m]) {
					var n = GS.Dom.getStyle(c, m);
					if (n === false) return;
					f[m] = this._parseCSS(n + '');
				}
				if (!j[m]) j[m] = this._parseCSS(o.toString());
				var l = '';
				GS.Array.forEach(f[m], function (q, p) {
					if (isNaN(j[m][p].numPart) && j[m][p].textPart == '?') {
						l = q.numPart + q.textPart;
					} else if (isNaN(q.numPart)) {
						l = q.textPart;
					} else l += (q.numPart + Math.ceil((j[m][p].numPart - q.numPart) * Math.sin(Math.PI / 2 * k))) + j[m][p].textPart + ' ';
				});
				GS.Dom.setStyle(c, m, l);
			}, this));
			if (k == 1) {
				clearInterval(i);
				if (b) b(c);
			}
		}, this), e);
	},
	_parseCSS: function (a) {
		var b = [];
		GS.Array.forEach(a.split(' '), function (d) {
			var c = parseInt(d, 10);
			b.push({
				numPart: c,
				textPart: d.replace(c, '')
			});
		});
		return b;
	}
});
GS.provide('Insights', {
	impression: function (e, a) {
		var b = GS.guid(),
		g = "//ah8.'+GSConstants._baseDomain+'/impression.php/" + b + "/",
		c = new Image(1, 1),
		f = [];
		if (!e.api_key && GS._apiKey) e.api_key = GS._apiKey;
		for (var d in e) f.push(encodeURIComponent(d) + '=' + encodeURIComponent(e[d]));
		g += '?' + f.join('&');
		if (a) c.onload = a;
		c.src = g;
	}
});
GS.subclass('XGSML.ConnectBar', 'XGSML.Element', null, {
	_initialHeight: null,
	_initTopMargin: 0,
	_picFieldName: 'pic_square',
	_page: null,
	_displayed: false,
	_notDisplayed: false,
	_container: null,
	_animationSpeed: 0,
	imgs: {
		buttonUrl: "rsrc/png/yY-r-h_Y6u1wrZPW.png",
		missingProfileUrl: "rsrc/gif/yo-r-UlIqmHJn-SK.gif"
	},
	process: function () {
		GS.getLoginStatus(this.bind(function (a) {
			GS.Event.monitor('auth.statusChange', this.bind(function () {
				if (this.isValid() && GS._userStatus == 'connected') {
					this._uid = GS.Helper.getLoggedInUser();
					GS.api({
						method: 'Connect.shouldShowConnectBar'
					}, this.bind(function (b) {
						if (b != 2) {
							this._animationSpeed = (b == 0) ? 750 : 0;
							this._showBar();
						} else this._noRender();
					}));
				} else this._noRender();
				return false;
			}));
		}));
	},
	_showBar: function () {
		var a = GS.Data._selectByIndex(['first_name', 'profile_url', this._picFieldName], 'user', 'uid', this._uid);
		var b = GS.Data._selectByIndex(['display_name'], 'application', 'api_key', GS._apiKey);
		GS.Data.waitOn([a, b], GS.bind(function (c) {
			c[0][0].site_name = c[1][0].display_name;
			if (!this._displayed) {
				this._displayed = true;
				this._notDisplayed = false;
				this._renderConnectBar(c[0][0]);
				this.fire('render');
				GS.Insights.impression({
					lid: 104,
					name: 'widget_load'
				});
				this.fire('connectbar.ondisplay');
				GS.Event.fire('connectbar.ondisplay', this);
				GS.Helper.invokeHandler(this.getAttribute('on-display'), this);
			}
		}, this));
	},
	_noRender: function () {
		if (this._displayed) {
			this._displayed = false;
			this._closeConnectBar();
		}
		if (!this._notDisplayed) {
			this._notDisplayed = true;
			this.fire('render');
			this.fire('connectbar.onnotdisplay');
			GS.Event.fire('connectbar.onnotdisplay', this);
			GS.Helper.invokeHandler(this.getAttribute('on-not-display'), this);
		}
	},
	_renderConnectBar: function (d) {
		var b = document.createElement('div'),
		c = document.createElement('div');
		b.className = 'gs_connect_bar';
		c.className = 'gs_reset gs_connect_bar_container';
		c.appendChild(b);
		document.body.appendChild(c);
		this._container = c;
		this._initialHeight = Math.round(parseFloat(GS.Dom.getStyle(c, 'height')) + parseFloat(GS.Dom.getStyle(c, 'borderBottomWidth')));
		b.innerHTML = GS.String.format('<div class="gs_buttons">' + '<a href="#" class="gs_bar_close">' + '<img src="{1}" alt="{2}" title="{2}"/>' + '</a>' + '</div>' + '<a href="{7}" class="gs_profile" target="_blank">' + '<img src="{3}" alt="{4}" title="{4}"/>' + '</a>' + '{5}' + ' <span>' + '<a href="{8}" class="gs_learn_more" target="_blank">{6}</a> &ndash; ' + '<a href="#" class="gs_no_thanks">{0}</a>' + '</span>', GS.Intl._tx("No Thanks"), GS.getDomain('cdn') + GS.XGSML.ConnectBar.imgs.buttonUrl, GS.Intl._tx("Close"), d[this._picFieldName] || GS.getDomain('cdn') + GS.XGSML.ConnectBar.imgs.missingProfileUrl, GS.String.escapeHTML(d.first_name), GS.Intl._tx("Hi {firstName}. \u003cstrong>{siteName}\u003c\/strong> is using GameStamper to personalize your experience.", {
			firstName: GS.String.escapeHTML(d.first_name),
			siteName: GS.String.escapeHTML(d.site_name)
		}), GS.Intl._tx("Learn More"), d.profile_url, GS.getDomain('www') + 'sitetour/connect.php');
		var a = this;
		GS.Array.forEach(b.getElementsByTagName('a'), function (g) {
			g.onclick = GS.bind(a._clickHandler, a);
		});
		this._page = document.body;
		var f = 0;
		if (this._page.parentNode) {
			f = Math.round((parseFloat(GS.Dom.getStyle(this._page.parentNode, 'height')) - parseFloat(GS.Dom.getStyle(this._page, 'height'))) / 2);
		} else f = parseInt(GS.Dom.getStyle(this._page, 'marginTop'), 10);
		f = isNaN(f) ? 0 : f;
		this._initTopMargin = f;
		if (!window.XMLHttpRequest) {
			c.className += " gs_connect_bar_container_ie6";
		} else {
			c.style.top = (-1 * this._initialHeight) + 'px';
			GS.Anim.ate(c, {
				top: '0px'
			}, this._animationSpeed);
		}
		var e = {
			marginTop: this._initTopMargin + this._initialHeight + 'px'
		};
		if (GS.UA.ie()) {
			e.backgroundPositionY = this._initialHeight + 'px';
		} else e.backgroundPosition = '? ' + this._initialHeight + 'px';
		GS.Anim.ate(this._page, e, this._animationSpeed);
	},
	_clickHandler: function (a) {
		a = a || window.event;
		var b = a.target || a.srcElement;
		while (b.nodeName != 'A') b = b.parentNode;
		switch (b.className) {
			case 'gs_bar_close':
				GS.api({
					method: 'Connect.connectBarMarkAcknowledged'
				});
				GS.Insights.impression({
					lid: 104,
					name: 'widget_user_closed'
				});
				this._closeConnectBar();
				break;
			case 'gs_learn_more':
			case 'gs_profile':
				window.open(b.href);
				break;
			case 'gs_no_thanks':
				this._closeConnectBar();
				GS.api({
					method: 'Connect.connectBarMarkAcknowledged'
				});
				GS.Insights.impression({
					lid: 104,
					name: 'widget_user_no_thanks'
				});
				GS.api({
					method: 'auth.revokeAuthorization',
					block: true
				}, this.bind(function () {
					this.fire('connectbar.ondeauth');
					GS.Event.fire('connectbar.ondeauth', this);
					GS.Helper.invokeHandler(this.getAttribute('on-deauth'), this);
					if (this._getBoolAttribute('auto-refresh', true)) window.location.reload();
				}));
				break;
		}
		return false;
	},
	_closeConnectBar: function () {
		this._notDisplayed = true;
		var a = {
			marginTop: this._initTopMargin + 'px'
		};
		if (GS.UA.ie()) {
			a.backgroundPositionY = '0px';
		} else a.backgroundPosition = '? 0px';
		var b = (this._animationSpeed == 0) ? 0 : 300;
		GS.Anim.ate(this._page, a, b);
		GS.Anim.ate(this._container, {
			top: (-1 * this._initialHeight) + 'px'
		}, b, function (c) {
			c.parentNode.removeChild(c);
		});
		this.fire('connectbar.onclose');
		GS.Event.fire('connectbar.onclose', this);
		GS.Helper.invokeHandler(this.getAttribute('on-close'), this);
	}
});
GS.provide('XGSML.ConnectBar', {
	imgs: {
		buttonUrl: 'images/facebook-widgets/close_btn.png',
		missingProfileUrl: 'pics/q_silhouette.gif'
	}
});
GS.subclass('XGSML.Fan', 'XGSML.IframeWidget', null, {
	_visibleAfter: 'load',
	setupAndValidate: function () {
		this._attr = {
			api_key: GS._apiKey,
			connections: this.getAttribute('connections', '10'),
			css: this.getAttribute('css'),
			height: this._getPxAttribute('height'),
			id: this.getAttribute('profile-id'),
			logobar: this._getBoolAttribute('logo-bar'),
			name: this.getAttribute('name'),
			stream: this._getBoolAttribute('stream', true),
			width: this._getPxAttribute('width', 300)
		};
		if (!this._attr.id && !this._attr.name) {
			GS.log('<gs:fan> requires one of the "id" or "name" attributes.');
			return false;
		}
		var a = this._attr.height;
		if (!a) if ((!this._attr.connections || this._attr.connections === '0') && !this._attr.stream) {
			a = 65;
		} else if (!this._attr.connections || this._attr.connections === '0') {
			a = 375;
		} else if (!this._attr.stream) {
			a = 250;
		} else a = 550;
		if (this._attr.logobar) a += 25;
		this._attr.height = a;
		return true;
	},
	getSize: function () {
		return {
			width: this._attr.width,
			height: this._attr.height
		};
	},
	getUrlBits: function () {
		return {
			name: 'fan',
			params: this._attr
		};
	}
});
GS.subclass('XGSML.Friendpile', 'XGSML.Facepile', null, {});
GS.subclass('XGSML.EdgeCommentWidget', 'XGSML.IframeWidget', function (a) {
	this._iframeWidth = a.width + 1;
	this._iframeHeight = a.height;
	this._attr = {
		master_frame_name: a.masterFrameName
	};
	this.dom = a.commentNode;
	this.dom.style.top = a.relativeHeightOffset;
	if (a.relativeWidthOffset) if (GS._localeIsRtl) {
		this.dom.style.right = a.relativeWidthOffset;
	} else this.dom.style.left = a.relativeWidthOffset;
	this.dom.style.zIndex = GS.XGSML.EdgeCommentWidget.NextZIndex++;
	GS.Dom.addCss(this.dom, 'gs_edge_comment_widget');
}, {
	_visibleAfter: 'load',
	_showLoader: false,
	getSize: function () {
		return {
			width: this._iframeWidth,
			height: this._iframeHeight
		};
	},
	getUrlBits: function () {
		return {
			name: 'comment_widget_shell',
			params: this._attr
		};
	}
});
GS.provide('XGSML.EdgeCommentWidget', {
	NextZIndex: 10000
});
GS.subclass('XGSML.EdgeWidget', 'XGSML.IframeWidget', null, {
	_visibleAfter: 'immediate',
	_showLoader: false,
	setupAndValidate: function () {
		GS.Dom.addCss(this.dom, 'gs_edge_widget_with_comment');
		this._attr = {
			channel_url: this.getChannelUrl(),
			debug: this._getBoolAttribute('debug'),
			href: this.getAttribute('href', window.location.href),
			is_permalink: this._getBoolAttribute('is-permalink'),
			node_type: this.getAttribute('node-type', 'link'),
			width: this._getWidgetWidth(),
			font: this.getAttribute('font'),
			layout: this._getLayout(),
			colorscheme: this.getAttribute('color-scheme'),
			action: this.getAttribute('action'),
			ref: this.getAttribute('ref'),
			show_faces: this._shouldShowFaces(),
			no_resize: this._getBoolAttribute('no_resize'),
			send: this.getAttribute('send'),
			url_map: this.getAttribute('url_map'),
			extended_social_context: this._getBoolAttribute('extended_social_context', false)
		};
		return true;
	},
	oneTimeSetup: function () {
		this.subscribe('xd.authPrompted', GS.bind(this._onAuthPrompt, this));
		this.subscribe('xd.edgeCreated', GS.bind(this._onEdgeCreate, this));
		this.subscribe('xd.edgeRemoved', GS.bind(this._onEdgeRemove, this));
		this.subscribe('xd.presentEdgeCommentDialog', GS.bind(this._handleEdgeCommentDialogPresentation, this));
		this.subscribe('xd.dismissEdgeCommentDialog', GS.bind(this._handleEdgeCommentDialogDismissal, this));
		this.subscribe('xd.hideEdgeCommentDialog', GS.bind(this._handleEdgeCommentDialogHide, this));
		this.subscribe('xd.showEdgeCommentDialog', GS.bind(this._handleEdgeCommentDialogShow, this));
	},
	getSize: function () {
		return {
			width: this._getWidgetWidth(),
			height: this._getWidgetHeight()
		};
	},
	_getWidgetHeight: function () {
		var b = this._getLayout();
		var e = this._shouldShowFaces() ? 'show' : 'hide';
		var d = this.getAttribute('send');
		var a = 65 + (d && d !== 'false' ? 25 : 0);
		var c = {
			standard: {
				show: 80,
				hide: 35
			},
			box_count: {
				show: a,
				hide: a
			},
			button_count: {
				show: 21,
				hide: 21
			},
			simple: {
				show: 20,
				hide: 20
			}
		};
		return c[b][e];
	},
	_getWidgetWidth: function () {
		var e = this._getLayout();
		var g = this.getAttribute('send');
		var h = this._shouldShowFaces() ? 'show' : 'hide';
		var c = (this.getAttribute('action') === 'recommend' ? 130 : 90) + (g && g !== 'false' ? 60 : 0);
		var b = this.getAttribute('action') === 'recommend' ? 100 : 55;
		var i = this.getAttribute('action') === 'recommend' ? 90 : 50;
		var f = {
			standard: {
				show: 450,
				hide: 450
			},
			box_count: {
				show: b,
				hide: b
			},
			button_count: {
				show: c,
				hide: c
			},
			simple: {
				show: i,
				hide: i
			}
		};
		var d = f[e][h];
		var j = this._getPxAttribute('width', d);
		var a = {
			standard: {
				min: 225,
				max: 900
			},
			box_count: {
				min: b,
				max: 900
			},
			button_count: {
				min: c,
				max: 900
			},
			simple: {
				min: 49,
				max: 900
			}
		};
		if (j < a[e].min) {
			j = a[e].min;
		} else if (j > a[e].max) j = a[e].max;
		return j;
	},
	_getLayout: function () {
		return this._getAttributeFromList('layout', 'standard', ['standard', 'button_count', 'box_count', 'simple']);
	},
	_shouldShowFaces: function () {
		return this._getLayout() === 'standard' && this._getBoolAttribute('show-faces', true);
	},
	_handleEdgeCommentDialogPresentation: function (b) {
		if (!this.isValid()) return;
		var a = document.createElement('span');
		this._commentSlave = this._createEdgeCommentWidget(b, a);
		this.dom.appendChild(a);
		this._commentSlave.process();
		this._commentWidgetNode = a;
	},
	_createEdgeCommentWidget: function (b, a) {
		var c = {
			commentNode: a,
			externalUrl: b.externalURL,
			width: 400,
			height: 225,
			masterFrameName: b.masterFrameName,
			layout: this._getLayout(),
			relativeHeightOffset: this._getHeightOffset(b),
			relativeWidthOffset: this._getWidthOffset(b)
		};
		return new GS.XGSML.EdgeCommentWidget(c);
	},
	_getHeightOffset: function (c) {
		if (c && c.preComputedHeightOffset) return parseInt(c.preComputedHeightOffset, 10) + 'px';
		var a = this._getLayout();
		var b = {
			standard: '22px',
			button_count: '19px',
			box_count: '-5px',
			simple: '18px'
		};
		return b[a];
	},
	_getCommonEdgeCommentWidgetOpts: function (c, a, d, b) {
		return {
			colorscheme: this._attr.colorscheme,
			commentNode: a,
			controllerID: c.controllerID,
			nodeImageURL: c.nodeImageURL,
			nodeRef: this._attr.ref,
			nodeTitle: c.nodeTitle,
			nodeURL: c.nodeURL,
			nodeSummary: c.nodeSummary,
			width: 400,
			height: 300,
			relativeHeightOffset: (b ? this._getHeightOffset(c) : this._getHeightOffset()),
			relativeWidthOffset: (d ? this._getWidthOffset(c) : this._getWidthOffset()),
			error: c.error,
			siderender: c.siderender,
			extended_social_context: c.extended_social_context
		};
	},
	_getWidthOffset: function (c) {
		if (c && c.preComputedWidthOffset) return parseInt(c.preComputedWidthOffset, 10) + 'px';
		var a = this._getLayout();
		var b = {
			standard: '0px',
			box_count: '0px',
			button_count: '0px',
			simple: '0px'
		};
		return b[a];
	},
	_handleEdgeCommentDialogDismissal: function (a) {
		if (this._commentWidgetNode) {
			this.dom.removeChild(this._commentWidgetNode);
			delete this._commentWidgetNode;
		}
	},
	_handleEdgeCommentDialogHide: function () {
		if (this._commentWidgetNode) this._commentWidgetNode.style.display = "none";
	},
	_handleEdgeCommentDialogShow: function () {
		if (this._commentWidgetNode) this._commentWidgetNode.style.display = "block";
	},
	_fireEventAndInvokeHandler: function (b, a) {
		GS.Helper.fireEvent(b, this);
		GS.Helper.invokeHandler(this.getAttribute(a), this, [this._attr.href]);
	},
	_onEdgeCreate: function () {
		this._fireEventAndInvokeHandler('edge.create', 'on-create');
	},
	_onEdgeRemove: function () {
		this._fireEventAndInvokeHandler('edge.remove', 'on-remove');
	},
	_onAuthPrompt: function () {
		this._fireEventAndInvokeHandler('auth.prompt', 'on-prompt');
	}
});
GS.subclass('XGSML.SendButtonFormWidget', 'XGSML.EdgeCommentWidget', function (a) {
	this._base(a);
	GS.Dom.addCss(this.dom, 'gs_send_button_form_widget');
	GS.Dom.addCss(this.dom, a.colorscheme);
	GS.Dom.addCss(this.dom, (typeof a.siderender != 'undefined' && a.siderender) ? 'siderender' : '');
	this._attr.nodeImageURL = a.nodeImageURL;
	this._attr.nodeRef = a.nodeRef;
	this._attr.nodeTitle = a.nodeTitle;
	this._attr.nodeURL = a.nodeURL;
	this._attr.nodeSummary = a.nodeSummary;
	this._attr.channel = this.getChannelUrl();
	this._attr.controllerID = a.controllerID;
	this._attr.colorscheme = a.colorscheme;
	this._attr.error = a.error;
	this._attr.siderender = a.siderender;
	this._attr.extended_social_context = a.extended_social_context;
}, {
	_showLoader: true,
	getUrlBits: function () {
		return {
			name: 'send_button_form_shell',
			params: this._attr
		};
	},
	oneTimeSetup: function () {
		this.subscribe('xd.messageSent', GS.bind(this._onMessageSent, this));
	},
	_onMessageSent: function () {
		GS.Event.fire('message.send', this._attr.nodeURL, this);
	}
});
GS.subclass('XGSML.Send', 'XGSML.EdgeWidget', null, {
	setupAndValidate: function () {
		GS.Dom.addCss(this.dom, 'gs_edge_widget_with_comment');
		this._attr = {
			channel: this.getChannelUrl(),
			api_key: GS._apiKey,
			font: this.getAttribute('font'),
			colorscheme: this.getAttribute('colorscheme', 'light'),
			href: this.getAttribute('href', window.location.href),
			ref: this.getAttribute('ref'),
			extended_social_context: this.getAttribute('extended_social_context', false)
		};
		return true;
	},
	getUrlBits: function () {
		return {
			name: 'send',
			params: this._attr
		};
	},
	_createEdgeCommentWidget: function (b, a) {
		var c = this._getCommonEdgeCommentWidgetOpts(b, a);
		return new GS.XGSML.SendButtonFormWidget(c);
	},
	_getHeightOffset: function () {
		return '21px';
	},
	_getWidthOffset: function () {
		return '0px';
	},
	getSize: function () {
		return {
			width: GS.XGSML.Send.Dimensions.width,
			height: GS.XGSML.Send.Dimensions.height
		};
	}
});
GS.provide('XGSML.Send', {
	Dimensions: {
		width: 56,
		height: 25
	}
});
GS.subclass('XGSML.Like', 'XGSML.EdgeWidget', null, {
	_widgetPipeEnabled: true,
	getUrlBits: function () {
		return {
			name: 'like',
			params: this._attr
		};
	},
	_createEdgeCommentWidget: function (b, a) {
		if ('send' in this._attr && 'widget_type' in b && b.widget_type == 'send') {
			var c = this._getCommonEdgeCommentWidgetOpts(b, a, true, true);
			return new GS.XGSML.SendButtonFormWidget(c);
		} else return this._callBase("_createEdgeCommentWidget", b, a);
	},
	getIframeTitle: function () {
		return 'Like this content on GameStamper.';
	}
});
GS.subclass('XGSML.LikeBox', 'XGSML.IframeWidget', null, {
	_visibleAfter: 'load',
	setupAndValidate: function () {
		this._attr = {
			channel: this.getChannelUrl(),
			api_key: GS._apiKey,
			connections: this.getAttribute('connections'),
			css: this.getAttribute('css'),
			height: this.getAttribute('height'),
			id: this.getAttribute('profile-id'),
			header: this._getBoolAttribute('header', true),
			name: this.getAttribute('name'),
			show_faces: this._getBoolAttribute('show-faces', true),
			stream: this._getBoolAttribute('stream', true),
			width: this._getPxAttribute('width', 300),
			href: this.getAttribute('href'),
			colorscheme: this.getAttribute('colorscheme', 'light'),
			border_color: this.getAttribute('border_color')
		};
		if (this._getBoolAttribute('force_wall', false)) this._attr.force_wall = true;
		if (this._attr.connections === '0') {
			this._attr.show_faces = false;
		} else if (this._attr.connections) this._attr.show_faces = true;
		if (!this._attr.id && !this._attr.name && !this._attr.href) {
			GS.log('<gs:like-box> requires one of the "id" or "name" attributes.');
			return false;
		}
		var a = this._attr.height;
		if (!a) if (!this._attr.show_faces && !this._attr.stream) {
			a = 62;
		} else {
			a = 95;
			if (this._attr.show_faces) a += 163;
			if (this._attr.stream) a += 300;
			if (this._attr.header && this._attr.header !== '0') a += 32;
		}
		this._attr.height = a;
		this.subscribe('xd.likeboxLiked', GS.bind(this._onLiked, this));
		this.subscribe('xd.likeboxUnliked', GS.bind(this._onUnliked, this));
		return true;
	},
	getSize: function () {
		return {
			width: this._attr.width,
			height: this._attr.height
		};
	},
	getUrlBits: function () {
		return {
			name: 'likebox',
			params: this._attr
		};
	},
	_onLiked: function () {
		GS.Helper.fireEvent('edge.create', this);
	},
	_onUnliked: function () {
		GS.Helper.fireEvent('edge.remove', this);
	}
});
GS.subclass('XGSML.LiveStream', 'XGSML.IframeWidget', null, {
	_visibleAfter: 'load',
	setupAndValidate: function () {
		this._attr = {
			app_id: this.getAttribute('event-app-id'),
			height: this._getPxAttribute('height', 500),
			hideFriendsTab: this.getAttribute('hide-friends-tab'),
			redesigned: this._getBoolAttribute('redesigned-stream'),
			width: this._getPxAttribute('width', 400),
			xid: this.getAttribute('xid', 'default'),
			always_post_to_friends: this._getBoolAttribute('always-post-to-friends', false),
			via_url: this.getAttribute('via_url')
		};
		return true;
	},
	getSize: function () {
		return {
			width: this._attr.width,
			height: this._attr.height
		};
	},
	getUrlBits: function () {
		var a = this._attr.redesigned ? 'live_stream_box' : 'livefeed';
		return {
			name: a,
			params: this._attr
		};
	}
});
GS.subclass('XGSML.Login', 'XGSML.Facepile', null, {
	_visibleAfter: 'load',
	getSize: function () {
		return {
			width: this._attr.width,
			height: 94
		};
	},
	getUrlBits: function () {
		return {
			name: 'login',
			params: this._attr
		};
	}
});
GS.subclass('XGSML.LoginButton', 'XGSML.ButtonElement', null, {
	setupAndValidate: function () {
		if (this._alreadySetup) return true;
		this._alreadySetup = true;
		this._attr = {
			autologoutlink: this._getBoolAttribute('auto-logout-link'),
			length: this._getAttributeFromList('length', 'short', ['long', 'short']),
			onlogin: this.getAttribute('on-login'),
			perms: this.getAttribute('perms'),
			scope: this.getAttribute('scope'),
			registration_url: this.getAttribute('registration-url'),
			status: 'unknown'
		};
		if (this._attr.autologoutlink) GS.Event.subscribe('auth.statusChange', GS.bind(this.process, this));
		if (this._attr.registration_url) {
			GS.Event.subscribe('auth.statusChange', this._saveStatus(this.process, false));
			GS.getLoginStatus(this._saveStatus(this.process, false));
		}
		return true;
	},
	getButtonMarkup: function () {
		var a = this.getOriginalHTML();
		if (a) return a;
		if (!this._attr.registration_url) {
			if (GS.getAccessToken() && this._attr.autologoutlink) {
				return GS.Intl._tx("GameStamper Logout");
			} else if (GS.getAccessToken()) {
				return '';
			} else return this._getLoginText();
		} else switch (this._attr.status) {
			case 'unknown':
				return this._getLoginText();
			case 'notConnected':
				return GS.Intl._tx("Register");
			case 'connected':
				if (GS.getAccessToken() && this._attr.autologoutlink) return GS.Intl._tx("Gamestamper Logout");
				return '';
			default:
				GS.log('Unknown status: ' + this.status);
				return GS.Intl._tx("Log In");
		}
	},
	_getLoginText: function () {
		return this._attr.length == 'short' ? GS.Intl._tx("Log In") : GS.Intl._tx("Log In with GameStamper");
	},
	onClick: function () {
		if (!this._attr.registration_url) {
			if (!GS.getAccessToken() || !this._attr.autologoutlink) {
				GS.login(GS.bind(this._authCallback, this), {
					perms: this._attr.perms,
					scope: this._attr.scope
				});
			} else GS.logout(GS.bind(this._authCallback, this));
		} else switch (this._attr.status) {
			case 'unknown':
				GS.ui({
					method: 'auth.logintoFacebook'
				}, GS.bind(function (a) {
					GS.bind(GS.getLoginStatus(this._saveStatus(this._authCallback, true), true), this);
				}, this));
				break;
			case 'notConnected':
				window.top.location = this._attr.registration_url;
				break;
			case 'connected':
				if (!GS.getAccessToken() || !this._attr.autologoutlink) {
					this._authCallback();
				} else GS.logout(GS.bind(this._authCallback, this));
				break;
			default:
				GS.log('Unknown status: ' + this.status);
		}
	},
	_authCallback: function (a) {
		GS.Helper.invokeHandler(this._attr.onlogin, this, [a]);
	},
	_saveStatus: function (a, b) {
		return GS.bind(function (c) {
			if (b && this._attr.registration_url && this._attr.status == 'notConnected' && c.status == 'notConnected') window.top.location = this._attr.registration_url;
			this._attr.status = c.status;
			if (a) {
				a = this.bind(a, this);
				return a(c);
			}
		}, this);
	}
});
GS.subclass('XGSML.Name', 'XGSML.Element', null, {
	process: function () {
		GS.copy(this, {
			_uid: this.getAttribute('uid'),
			_firstnameonly: this._getBoolAttribute('first-name-only'),
			_lastnameonly: this._getBoolAttribute('last-name-only'),
			_possessive: this._getBoolAttribute('possessive'),
			_reflexive: this._getBoolAttribute('reflexive'),
			_objective: this._getBoolAttribute('objective'),
			_linked: this._getBoolAttribute('linked', true),
			_subjectId: this.getAttribute('subject-id')
		});
		if (!this._uid) {
			GS.log('"uid" is a required attribute for <gs:name>');
			this.fire('render');
			return;
		}
		var b = [];
		if (this._firstnameonly) {
			b.push('first_name');
		} else if (this._lastnameonly) {
			b.push('last_name');
		} else b.push('name');
		if (this._subjectId) {
			b.push('sex');
			if (this._subjectId == GS.Helper.getLoggedInUser()) this._reflexive = true;
		}
		var a;
		GS.Event.monitor('auth.statusChange', this.bind(function () {
			if (!this.isValid()) {
				this.fire('render');
				return true;
			}
			if (!this._uid || this._uid == 'loggedinuser') this._uid = GS.Helper.getLoggedInUser();
			if (!this._uid) return;
			if (GS.Helper.isUser(this._uid)) {
				a = GS.Data._selectByIndex(b, 'user', 'uid', this._uid);
			} else a = GS.Data._selectByIndex(['name', 'id'], 'profile', 'id', this._uid);
			a.wait(this.bind(function (c) {
				if (this._subjectId == this._uid) {
					this._renderPronoun(c[0]);
				} else this._renderOther(c[0]);
				this.fire('render');
			}));
		}));
	},
	_renderPronoun: function (b) {
		var c = '',
		a = this._objective;
		if (this._subjectId) {
			a = true;
			if (this._subjectId === this._uid) this._reflexive = true;
		}
		if (this._uid == GS.Connect.get_loggedInUser() && this._getBoolAttribute('use-you', true)) {
			if (this._possessive) {
				if (this._reflexive) {
					c = 'your own';
				} else c = 'your';
			} else if (this._reflexive) {
				c = 'yourself';
			} else c = 'you';
		} else switch (b.sex) {
			case 'male':
				if (this._possessive) {
					c = this._reflexive ? 'his own' : 'his';
				} else if (this._reflexive) {
					c = 'himself';
				} else if (a) {
					c = 'him';
				} else c = 'he';
				break;
			case 'female':
				if (this._possessive) {
					c = this._reflexive ? 'her own' : 'her';
				} else if (this._reflexive) {
					c = 'herself';
				} else if (a) {
					c = 'her';
				} else c = 'she';
				break;
			default:
				if (this._getBoolAttribute('use-they', true)) {
					if (this._possessive) {
						if (this._reflexive) {
							c = 'their own';
						} else c = 'their';
					} else if (this._reflexive) {
						c = 'themselves';
					} else if (a) {
						c = 'them';
					} else c = 'they';
				} else if (this._possessive) {
					if (this._reflexive) {
						c = 'his/her own';
					} else c = 'his/her';
				} else if (this._reflexive) {
					c = 'himself/herself';
				} else if (a) {
					c = 'him/her';
				} else c = 'he/she';
				break;
		}
		if (this._getBoolAttribute('capitalize', false)) c = GS.Helper.upperCaseFirstChar(c);
		this.dom.innerHTML = c;
	},
	_renderOther: function (c) {
		var b = '',
		a = '';
		if (this._uid == GS.Helper.getLoggedInUser() && this._getBoolAttribute('use-you', true)) {
			if (this._reflexive) {
				if (this._possessive) {
					b = 'your own';
				} else b = 'yourself';
			} else if (this._possessive) {
				b = 'your';
			} else b = 'you';
		} else if (c) {
			if (null === c.first_name) c.first_name = '';
			if (null === c.last_name) c.last_name = '';
			if (this._firstnameonly && c.first_name !== undefined) {
				b = GS.String.escapeHTML(c.first_name);
			} else if (this._lastnameonly && c.last_name !== undefined) b = GS.String.escapeHTML(c.last_name);
			if (!b) b = GS.String.escapeHTML(c.name);
			if (b !== '' && this._possessive) b += '\'s';
		}
		if (!b) b = GS.String.escapeHTML(this.getAttribute('if-cant-see', 'GameStamper User'));
		if (b) {
			if (this._getBoolAttribute('capitalize', false)) b = GS.Helper.upperCaseFirstChar(b);
			if (c && this._linked) {
				a = GS.Helper.getProfileLink(c, b, this.getAttribute('href', null));
			} else a = b;
		}
		this.dom.innerHTML = a;
	}
});
GS.subclass('XGSML.ProfilePic', 'XGSML.Element', null, {
	_defPicMap: {
		pic: "rsrc/jpg/yh-r-C5yt7Cqf3zU.jpg",
		pic_big: "rsrc/gif/yL-r-HsTZSDw4avx.gif",
		pic_big_with_logo: "rsrc/gif/y5-r-SRDCaeCL7hM.gif",
		pic_small: "rsrc/jpg/yi-r-odA9sNLrE86.jpg",
		pic_small_with_logo: "rsrc/gif/yD-r-k1xiRXKnlGd.gif",
		pic_square: "rsrc/gif/yo-r-UlIqmHJn-SK.gif",
		pic_square_with_logo: "rsrc/gif/yX-r-9dYJBPDHXwZ.gif",
		pic_with_logo: "rsrc/gif/yu-r-fPPR9f2FJ3t.gif"
	},
	process: function () {
		var d = this.getAttribute('size', 'thumb'),
		b = GS.XGSML.ProfilePic._sizeToPicFieldMap[d],
		g = this._getPxAttribute('width'),
		a = this._getPxAttribute('height'),
		e = this.dom.style,
		f = this.getAttribute('uid');
		if (this._getBoolAttribute('facebook-logo')) b += '_with_logo';
		if (g) {
			g = g + 'px';
			e.width = g;
		}
		if (a) {
			a = a + 'px';
			e.height = a;
		}
		var c = this.bind(function (j) {
			var l = j ? j[0] : null,
			i = l ? l[b] : null;
			if (!i) i = GS.getDomain('cdn') + GS.XGSML.ProfilePic._defPicMap[b];
			var k = ((g ? 'width:' + g + ';' : '') + (a ? 'height:' + g + ';' : '')),
			h = GS.String.format('<img src="{0}" alt="{1}" title="{1}" style="{2}" class="{3}" />', i, l ? GS.String.escapeHTML(l.name) : '', k, this.dom.className);
			if (this._getBoolAttribute('linked', true)) h = GS.Helper.getProfileLink(l, h, this.getAttribute('href', null));
			this.dom.innerHTML = h;
			GS.Dom.addCss(this.dom, 'gs_profile_pic_rendered');
			this.fire('render');
		});
		GS.Event.monitor('auth.statusChange', this.bind(function () {
			if (!this.isValid()) {
				this.fire('render');
				return true;
			}
			if (this.getAttribute('uid', null) == 'loggedinuser') f = GS.Helper.getLoggedInUser();
			if (GS._userStatus && f) {
				GS.Data._selectByIndex(['name', b], GS.Helper.isUser(f) ? 'user' : 'profile', GS.Helper.isUser(f) ? 'uid' : 'id', f).wait(c);
			} else c();
		}));
	}
});
GS.provide('XGSML.ProfilePic', {
	_defPicMap: {
		pic: 'pics/s_silhouette.jpg',
		pic_big: 'pics/d_silhouette.gif',
		pic_big_with_logo: 'pics/d_silhouette_logo.gif',
		pic_small: 'pics/t_silhouette.jpg',
		pic_small_with_logo: 'pics/t_silhouette_logo.gif',
		pic_square: 'pics/q_silhouette.gif',
		pic_square_with_logo: 'pics/q_silhouette_logo.gif',
		pic_with_logo: 'pics/s_silhouette_logo.gif'
	},
	_sizeToPicFieldMap: {
		n: 'pic_big',
		normal: 'pic_big',
		q: 'pic_square',
		s: 'pic',
		small: 'pic',
		square: 'pic_square',
		t: 'pic_small',
		thumb: 'pic_small'
	}
});
GS.subclass('XGSML.Question', 'XGSML.IframeWidget', null, {
	_visibleAfter: 'load',
	setupAndValidate: function () {
		this._attr = {
			channel: this.getChannelUrl(),
			api_key: GS._apiKey,
			permalink: this.getAttribute('permalink'),
			width: this.getAttribute('width', 400),
			height: 0
		};
		this.subscribe('xd.firstVote', GS.bind(this._onInitialVote, this));
		this.subscribe('xd.vote', GS.bind(this._onChangedVote, this));
		return true;
	},
	getSize: function () {
		return {
			width: this._attr.width,
			height: this._attr.height
		};
	},
	getUrlBits: function () {
		return {
			name: 'question',
			params: this._attr
		};
	},
	_onInitialVote: function (a) {
		GS.Event.fire('question.firstVote', this._attr.permalink, a.vote);
	},
	_onChangedVote: function (a) {
		GS.Event.fire('question.vote', this._attr.permalink, a.vote);
	}
});
GS.subclass('XGSML.Recommendations', 'XGSML.IframeWidget', null, {
	_visibleAfter: 'load',
	_refreshOnAuthChange: true,
	setupAndValidate: function () {
		this._attr = {
			border_color: this.getAttribute('border-color'),
			colorscheme: this.getAttribute('color-scheme'),
			filter: this.getAttribute('filter'),
			font: this.getAttribute('font'),
			action: this.getAttribute('action'),
			linktarget: this.getAttribute('linktarget', '_blank'),
			max_age: this.getAttribute('max_age'),
			header: this._getBoolAttribute('header'),
			height: this._getPxAttribute('height', 300),
			site: this.getAttribute('site', location.hostname),
			width: this._getPxAttribute('width', 300)
		};
		return true;
	},
	getSize: function () {
		return {
			width: this._attr.width,
			height: this._attr.height
		};
	},
	getUrlBits: function () {
		return {
			name: 'recommendations',
			params: this._attr
		};
	}
});
GS.subclass('XGSML.RecommendationsBar', 'XGSML.IframeWidget', null, {
	getUrlBits: function () {
		return {
			name: 'recommendations_bar',
			params: this._attr
		};
	},
	setupAndValidate: function () {
		function b(j, i) {
			var k = 0;
			var l = null;

			function m() {
				i();
				l = null;
				k = (new Date()).getTime();
			}
			return function () {
				if (!l) {
					var n = (new Date()).getTime();
					if (n - k < j) {
						l = window.setTimeout(m, j - (n - k));
					} else m();
				}
				return true;
			};
		}
		function g(j) {
			if (j.match(/^\d+(?:\.\d+)?%$/)) {
				var i = Math.min(Math.max(parseInt(j, 10), 0), 100);
				j = i / 100;
			} else if (j != 'manual' && j != 'onvisible') j = 'onvisible';
			return j;
		}
		function f(i) {
			return Math.max(parseInt(i, 10) || 30, 10);
		}
		this._attr = {
			channel: this.getChannelUrl(),
			api_key: GS._apiKey,
			font: this.getAttribute('font'),
			colorscheme: this.getAttribute('colorscheme'),
			side: this.getAttribute('side'),
			href: this.getAttribute('href', window.location.href),
			site: this.getAttribute('site'),
			action: this.getAttribute('action'),
			ref: this.getAttribute('ref'),
			trigger: g(this.getAttribute('trigger', '')),
			read_time: f(this.getAttribute('read_time'))
		};
		GS._inPlugin = true;
		this._showLoader = false;
		this.subscribe('iframe.onload', GS.bind(function () {
			var i = this._attr.side || (GS._localeIsRtl ? 'left' : 'right');
			var j = this.dom.children[0];
			j.className = 'fbpluginrecommendationsbar fbpluginrecommendationsbar' + i;
		}, this));
		var a = GS.bind(function () {
			GS.Event.unlisten(window, 'scroll', a);
			GS.Event.unlisten(document.documentElement, 'click', a);
			GS.Event.unlisten(document.documentElement, 'mousemove', a);
			window.setTimeout(GS.bind(this.arbiterInform, this, 'platform/plugins/social_bar/action', null, GS.XD.BEHAVIOR_STATE), this._attr.read_time * 1000);
			return true;
		}, this);
		GS.Event.listen(window, 'scroll', a);
		GS.Event.listen(document.documentElement, 'click', a);
		GS.Event.listen(document.documentElement, 'mousemove', a);
		if (this._attr.trigger == "manual") {
			var c = GS.bind(function (i) {
				if (i == this._attr.href) {
					GS.Event.unsubscribe('xgsml.recommendationsbar.read', c);
					this.arbiterInform('platform/plugins/social_bar/trigger', null, GS.XD.BEHAVIOR_STATE);
				}
				return true;
			}, this);
			GS.Event.subscribe('xgsml.recommendationsbar.read', c);
		} else {
			var e = b(500, GS.bind(function () {
				if (this.calculateVisibility()) {
					GS.Event.unlisten(window, 'scroll', e);
					GS.Event.unlisten(window, 'resize', e);
					this.arbiterInform('platform/plugins/social_bar/trigger', null, GS.XD.BEHAVIOR_STATE);
				}
				return true;
			}, this));
			GS.Event.listen(window, 'scroll', e);
			GS.Event.listen(window, 'resize', e);
			e();
		}
		this.visible = false;
		var h = b(500, GS.bind(function () {
			if (!this.visible && this.calculateVisibility()) {
				this.visible = true;
				this.arbiterInform('platform/plugins/social_bar/visible');
			} else if (this.visible && !this.calculateVisibility()) {
				this.visible = false;
				this.arbiterInform('platform/plugins/social_bar/invisible');
			}
			return true;
		}, this));
		GS.Event.listen(window, 'scroll', h);
		GS.Event.listen(window, 'resize', h);
		h();
		this.focused = true;
		var d = GS.bind(function () {
			this.focused = !this.focused;
			return true;
		}, this);
		GS.Event.listen(window, 'blur', d);
		GS.Event.listen(window, 'focus', d);
		this.resize_running = false;
		this.animate = false;
		this.subscribe('xd.signal_animation', GS.bind(function () {
			this.animate = true;
		}, this));
		return true;
	},
	getSize: function () {
		return {
			height: 25,
			width: (this._attr.action == 'recommend' ? 140 : 96)
		};
	},
	calculateVisibility: function () {
		var b = document.documentElement.clientHeight;
		if (!this.focused && window.console && window.console.firebug) return this.visible;
		switch (this._attr.trigger) {
			case "manual":
				return false;
			case "onvisible":
				var a = this.dom.getBoundingClientRect().top;
				return a <= b;
			default:
				var d = window.scrollY + b;
				var c = document.documentElement.scrollHeight;
				return d / c >= this._attr.trigger;
		}
	},
	_handleResizeMsg: function (a) {
		if (!this.isValid()) return;
		if (a.width) this.getIframeNode().style.width = a.width + 'px';
		if (a.height) {
			this._setNextResize(a.height);
			this._checkNextResize();
		}
		this._makeVisible();
	},
	_setNextResize: function (a) {
		this.next_resize = a;
	},
	_checkNextResize: function () {
		if (!this.next_resize || this.resize_running) return;
		var b = this.getIframeNode();
		var a = this.next_resize;
		this.next_resize = null;
		if (this.animate) {
			this.animate = false;
			this.resize_running = true;
			GS.Anim.ate(b, {
				height: a + 'px'
			}, 300, GS.bind(function () {
				this.resize_running = false;
				this._checkNextResize();
			}, this));
		} else b.style.height = a + 'px';
	}
});
GS.XGSML.RecommendationsBar.markRead = function (a) {
	GS.Event.fire('xgsml.recommendationsbar.read', a || window.location.href);
};
GS.subclass('XGSML.Registration', 'XGSML.IframeWidget', null, {
	_visibleAfter: 'immediate',
	_baseHeight: 167,
	_fieldHeight: 28,
	_skinnyWidth: 520,
	_skinnyBaseHeight: 173,
	_skinnyFieldHeight: 52,
	setupAndValidate: function () {
		this._attr = {
			action: this.getAttribute('action'),
			border_color: this.getAttribute('border-color'),
			channel_url: this.getChannelUrl(),
			client_id: GS._apiKey,
			gs_only: this._getBoolAttribute('gs-only', false),
			gs_register: this._getBoolAttribute('gs-register', false),
			fields: this.getAttribute('fields'),
			height: this._getPxAttribute('height'),
			redirect_uri: this.getAttribute('redirect-uri', window.location.href),
			no_footer: this._getBoolAttribute('no-footer'),
			no_header: this._getBoolAttribute('no-header'),
			onvalidate: this.getAttribute('onvalidate'),
			width: this._getPxAttribute('width', 600),
			target: this.getAttribute('target')
		};
		if (this._attr.onvalidate) this.subscribe('xd.validate', this.bind(function (b) {
			var d = GS.JSON.parse(b.value);
			var a = this.bind(function (e) {
				GS.XD.inform('Registration.Validation', {
					errors: e,
					id: b.id
				}, 'parent.frames["' + this.getIframeNode().name + '"]', window.location.protocol == 'https:');
			});
			var c = GS.Helper.executeFunctionByName(this._attr.onvalidate, d, a);
			if (c) a(c);
		}));
		this.subscribe('xd.authLogin', GS.bind(this._onAuthLogin, this));
		this.subscribe('xd.authLogout', GS.bind(this._onAuthLogout, this));
		return true;
	},
	getSize: function () {
		return {
			width: this._attr.width,
			height: this._getHeight()
		};
	},
	_getHeight: function () {
		if (this._attr.height) return this._attr.height;
		var b;
		if (!this._attr.fields) {
			b = ['name'];
		} else try {
			b = GS.JSON.parse(this._attr.fields);
		} catch (a) {
			b = this._attr.fields.split(/,/);
		}
		if (this._attr.width < this._skinnyWidth) {
			return this._skinnyBaseHeight + b.length * this._skinnyFieldHeight;
		} else return this._baseHeight + b.length * this._fieldHeight;
	},
	getUrlBits: function () {
		return {
			name: 'registration',
			params: this._attr
		};
	},
	getDefaultWebDomain: function () {
		return 'https_www';
	},
	_onAuthLogin: function () {
		if (!GS.getSession()) GS.getLoginStatus();
		GS.Helper.fireEvent('auth.login', this);
	},
	_onAuthLogout: function () {
		if (!GS.getSession()) GS.getLoginStatus();
		GS.Helper.fireEvent('auth.logout', this);
	}
});
GS.subclass('XGSML.ServerGsml', 'XGSML.IframeWidget', null, {
	_visibleAfter: 'resize',
	setupAndValidate: function () {
		this.ml = GSConstants._fb+'ml';
		this._attr = {
			channel_url: this.getChannelUrl(),
			width: this._getPxAttribute('width')
		};
		this._attr[this.ml] = this.getAttribute(this.ml);
		if (!this._attr[this.ml]) {
			var a = this.dom.getElementsByTagName('script')[0];
			if (a && a.type === 'text/'+this.ml) this._attr[this.ml] = a.innerHTML;
		}
		if (!this._attr[this.ml]) {
			GS.log('<gs:server'+this.ml+'> requires the "'+this.ml+'" attribute.');
			return false;
		}
		return true;
	},
	getSize: function () {
		return {
			width: this._attr.width,
			height: this._attr.height
		};
	},
	getUrlBits: function () {
		return {
			name: 'server'+this.ml,
			params: this._attr
		};
	}
});
GS.subclass('XGSML.ShareButton', 'XGSML.Element', null, {
	process: function () {
		this._href = this.getAttribute('href', window.location.href);
		this._type = this.getAttribute('type', 'icon_link');
		GS.Dom.addCss(this.dom, 'gs_share_count_hidden');
		this._renderButton(true);
	},
	_renderButton: function (h) {
		if (!this.isValid()) {
			this.fire('render');
			return;
		}
		var d = '',
		e = '',
		f = '',
		c = '',
		g = GS.Intl._tx("Share"),
		i = '';
		switch (this._type) {
			case 'icon':
			case 'icon_link':
				c = 'gs_button_simple';
				d = ('<span class="gs_button_text">' + (this._type == 'icon_link' ? g : '&nbsp;') + '</span>');
				h = false;
				break;
			case 'link':
				d = GS.Intl._tx("Share on Gamestamper");
				h = false;
				break;
			case 'button':
				d = '<span class="gs_button_text">' + g + '</span>';
				c = 'gs_button gs_button_small';
				h = false;
				break;
			case 'button_count':
				d = '<span class="gs_button_text">' + g + '</span>';
				e = ('<span class="gs_share_count_nub_right">&nbsp;</span>' + '<span class="gs_share_count gs_share_count_right">' + this._getCounterMarkup() + '</span>');
				c = 'gs_button gs_button_small';
				break;
			default:
				d = '<span class="gs_button_text">' + g + '</span>';
				f = ('<span class="gs_share_count_nub_top">&nbsp;</span>' + '<span class="gs_share_count gs_share_count_top">' + this._getCounterMarkup() + '</span>');
				c = 'gs_button gs_button_small';
				i = 'gs_share_count_wrapper';
		}
		var b = GS.guid();
		this.dom.innerHTML = GS.String.format('<span class="{0}">{4}<a id="{1}" class="{2}" ' + 'target="_blank">{3}</a>{5}</span>', i, b, c, d, f, e);
		var a = document.getElementById(b);
		a.href = this._href;
		a.onclick = function () {
			GS.ui({
				method: 'stream.share',
				u: this.href
			});
			return false;
		};
		if (!h) this.fire('render');
	},
	_getCounterMarkup: function () {
		if (!this._count) this._count = GS.Data._selectByIndex(['total_count'], 'link_stat', 'url', this._href);
		var b = '0';
		if (this._count.value !== undefined) {
			if (this._count.value.length > 0) {
				var a = this._count.value[0].total_count;
				if (a > 3) {
					GS.Dom.removeCss(this.dom, 'gs_share_count_hidden');
					b = a >= 1e+07 ? Math.round(a / 1e+06) + 'M' : (a >= 10000 ? Math.round(a / 1000) + 'K' : a);
				}
			}
		} else this._count.wait(GS.bind(this._renderButton, this, false));
		return '<span class="gs_share_count_inner">' + b + '</span>';
	}
});
void(0);

if (GS.Dom && GS.Dom.addCssRules) {
	GS.Dom.addCssRules(".gs_progress_title{display:none}\n.gs_hidden{position:absolute;top:-10000px;z-index:10001}\n.gs_reset{background:none;border-spacing:0;border:0;color:#000;cursor:auto;direction:ltr;font-family:\"lucida grande\", tahoma, verdana, arial, sans-serif;font-size:11px;font-style:normal;font-variant:normal;font-weight:normal;letter-spacing:normal;line-height:1;margin:0;overflow:visible;padding:0;text-align:left;text-decoration:none;text-indent:0;text-shadow:none;text-transform:none;visibility:visible;white-space:normal;word-spacing:normal}\n.gs_link img{border:none}\n.gs_dialog{position:absolute;top:-10000px;z-index:10001}\n.gs_dialog_advanced{background:rgba(82, 82, 82, .7);padding:"+(GSConstants.sizes.borderSize)+"px;-moz-border-radius:8px;-webkit-border-radius:8px}\n.gs_dialog_content{background:#fff;color:#333}\n.gs_dialog_close_icon{background:url(http:\/\/static.gamescdn.com\/rsrc\/png\/zq-r-IE9JII6Z1Ys.png) no-repeat scroll 0 0 transparent;_background-image:url(http:\/\/static.gamescdn.com\/rsrc\/gif\/zL-r-s816eWC-2sl.gif);cursor:pointer;display:block;height:15px;position:absolute;right:18px;top:17px;width:15px;top:8px\\9;right:7px\\9}\n.gs_dialog_close_icon:hover{background:url(http:\/\/static.gamescdn.com\/rsrc\/png\/zq-r-IE9JII6Z1Ys.png) no-repeat scroll 0 -15px transparent;_background-image:url(http:\/\/static.gamescdn.com\/rsrc\/gif\/zL-r-s816eWC-2sl.gif)}\n.gs_dialog_close_icon:active{background:url(http:\/\/static.gamescdn.com\/rsrc\/png\/zq-r-IE9JII6Z1Ys.png) no-repeat scroll 0 -30px transparent;_background-image:url(http:\/\/static.gamescdn.com\/rsrc\/gif\/zL-r-s816eWC-2sl.gif)}\n.gs_dialog_loader{background-color:#f2f2f2;border:1px solid #606060;font-size:24px;padding:20px}\n.gs_dialog_top_left,\n.gs_dialog_top_right,\n.gs_dialog_bottom_left,\n.gs_dialog_bottom_right{height:10px;width:10px;overflow:hidden;position:absolute}\n.gs_dialog_top_left{background:url(http:\/\/static.gamescdn.com\/rsrc\/png\/ze-r-8YeTNIlTZjm.png) no-repeat 0 0;left:-10px;top:-10px}\n.gs_dialog_top_right{background:url(http:\/\/static.gamescdn.com\/rsrc\/png\/ze-r-8YeTNIlTZjm.png) no-repeat 0 -10px;right:-10px;top:-10px}\n.gs_dialog_bottom_left{background:url(http:\/\/static.gamescdn.com\/rsrc\/png\/ze-r-8YeTNIlTZjm.png) no-repeat 0 -20px;bottom:-10px;left:-10px}\n.gs_dialog_bottom_right{background:url(http:\/\/static.gamescdn.com\/rsrc\/png\/ze-r-8YeTNIlTZjm.png) no-repeat 0 -30px;right:-10px;bottom:-10px}\n.gs_dialog_vert_left,\n.gs_dialog_vert_right,\n.gs_dialog_horiz_top,\n.gs_dialog_horiz_bottom{position:absolute;background:#525252;filter:alpha(opacity=70);opacity:.7}\n.gs_dialog_vert_left,\n.gs_dialog_vert_right{width:10px;height:100\u0025}\n.gs_dialog_vert_left{margin-left:-10px}\n.gs_dialog_vert_right{right:0;margin-right:-10px}\n.gs_dialog_horiz_top,\n.gs_dialog_horiz_bottom{width:100\u0025;height:10px}\n.gs_dialog_horiz_top{margin-top:-10px}\n.gs_dialog_horiz_bottom{bottom:0;margin-bottom:-10px}\n.gs_dialog_iframe{line-height:0}\n.gs_dialog_content .dialog_title{background:#6d84b4;border:1px solid #3b5998;color:#fff;font-size:14px;font-weight:bold;margin:0}\n.gs_dialog_content .dialog_title > span{float:left;padding:5px 0 7px 26px}\n.gs_dialog_content .dialog_content{background:url(http:\/\/static.gamescdn.com\/rsrc\/gif\/z9-r-jKEcVPZFk-2.gif) no-repeat 50\u0025 50\u0025;border:1px solid #555;border-bottom:0;border-top:0;height:150px}\n.gs_dialog_content .dialog_footer{background:#f2f2f2;border:1px solid #555;border-top-color:#ccc;height:40px}\n#gs_dialog_loader_close{float:right}\n.fb_iframe_widget{position:relative;display:-moz-inline-block;display:inline-block}\n.fb_iframe_widget iframe{position:relative;vertical-align:text-bottom}\n.fb_iframe_widget span{position:relative}\n.fb_hide_iframes iframe{position:relative;left:-10000px}\n.fb_iframe_widget_loader{position:relative;display:inline-block}\n.fb_iframe_widget_loader iframe{min-height:32px;z-index:2;zoom:1}\n.fb_iframe_widget_loader .GS_Loader{background:url(http:\/\/static.gamescdn.com\/rsrc\/gif\/z9-r-jKEcVPZFk-2.gif) no-repeat;height:32px;width:32px;margin-left:-16px;position:absolute;left:50\u0025;z-index:4}\n.gs_button_simple,\n.gs_button_simple_rtl{background-image:url(http:\/\/static.gamescdn.com\/rsrc\/png\/zH-r-eIpbnVKI9lR.png);background-repeat:no-repeat;cursor:pointer;outline:none;text-decoration:none}\n.gs_button_simple_rtl{background-position:right 0}\n.gs_button_simple .gs_button_text{margin:0 0 0 20px;padding-bottom:1px}\n.gs_button_simple_rtl .gs_button_text{margin:0 10px 0 0}\na.gs_button_simple:hover .gs_button_text,\na.gs_button_simple_rtl:hover .gs_button_text,\n.gs_button_simple:hover .gs_button_text,\n.gs_button_simple_rtl:hover .gs_button_text{text-decoration:underline}\n.gs_button,\n.gs_button_rtl{background:#29447e url(http:\/\/static.gamescdn.com\/rsrc\/png\/zL-r-FGFbc80dUKj.png);background-repeat:no-repeat;cursor:pointer;display:inline-block;padding:0 0 0 1px;text-decoration:none;outline:none}\n.gs_button .gs_button_text,\n.gs_button_rtl .gs_button_text{background:#5f78ab url(http:\/\/static.gamescdn.com\/rsrc\/png\/zL-r-FGFbc80dUKj.png);border-top:solid 1px #879ac0;border-bottom:solid 1px #1a356e;color:#fff;display:block;font-family:\"lucida grande\",tahoma,verdana,arial,sans-serif;font-weight:bold;padding:2px 6px 3px 6px;margin:1px 1px 0 21px;text-shadow:none}\na.gs_button,\na.gs_button_rtl,\n.gs_button,\n.gs_button_rtl{text-decoration:none}\na.gs_button:active .gs_button_text,\na.gs_button_rtl:active .gs_button_text,\n.gs_button:active .gs_button_text,\n.gs_button_rtl:active .gs_button_text{border-bottom:solid 1px #29447e;border-top:solid 1px #45619d;background:#4f6aa3;text-shadow:none}\n.gs_button_xlarge,\n.gs_button_xlarge_rtl{background-position:left -60px;font-size:24px;line-height:30px}\n.gs_button_xlarge .gs_button_text{padding:3px 8px 3px 12px;margin-left:38px}\na.gs_button_xlarge:active{background-position:left -99px}\n.gs_button_xlarge_rtl{background-position:right -268px}\n.gs_button_xlarge_rtl .gs_button_text{padding:3px 8px 3px 12px;margin-right:39px}\na.gs_button_xlarge_rtl:active{background-position:right -307px}\n.gs_button_large,\n.gs_button_large_rtl{background-position:left -138px;font-size:13px;line-height:16px}\n.gs_button_large .gs_button_text{margin-left:24px;padding:2px 6px 4px 6px}\na.gs_button_large:active{background-position:left -163px}\n.gs_button_large_rtl{background-position:right -346px}\n.gs_button_large_rtl .gs_button_text{margin-right:25px}\na.gs_button_large_rtl:active{background-position:right -371px}\n.gs_button_medium,\n.gs_button_medium_rtl{background-position:left -188px;font-size:11px;line-height:14px}\na.gs_button_medium:active{background-position:left -210px}\n.gs_button_medium_rtl{background-position:right -396px}\n.gs_button_text_rtl,\n.gs_button_medium_rtl .gs_button_text{padding:2px 6px 3px 6px;margin-right:22px}\na.gs_button_medium_rtl:active{background-position:right -418px}\n.gs_button_small,\n.gs_button_small_rtl{background-position:left -232px;font-size:10px;line-height:10px}\n.gs_button_small .gs_button_text{padding:2px 6px 3px;margin-left:17px}\na.gs_button_small:active,\n.gs_button_small:active{background-position:left -250px}\n.gs_button_small_rtl{background-position:right -440px}\n.gs_button_small_rtl .gs_button_text{padding:2px 6px;margin-right:18px}\na.gs_button_small_rtl:active{background-position:right -458px}\n.gs_connect_bar_container div,\n.gs_connect_bar_container span,\n.gs_connect_bar_container a,\n.gs_connect_bar_container img,\n.gs_connect_bar_container strong{background:none;border-spacing:0;border:0;direction:ltr;font-style:normal;font-variant:normal;letter-spacing:normal;line-height:1;margin:0;overflow:visible;padding:0;text-align:left;text-decoration:none;text-indent:0;text-shadow:none;text-transform:none;visibility:visible;white-space:normal;word-spacing:normal;vertical-align:baseline}\n.gs_connect_bar_container{position:fixed;left:0 !important;right:0 !important;height:42px !important;padding:0 25px !important;margin:0 !important;vertical-align:middle !important;border-bottom:1px solid #333 !important;background:#3b5998 !important;z-index:99999999 !important;overflow:hidden !important}\n.gs_connect_bar_container_ie6{position:absolute;top:expression(document.compatMode==\"CSS1Compat\"? document.documentElement.scrollTop+\"px\":body.scrollTop+\"px\")}\n.gs_connect_bar{position:relative;margin:auto;height:100\u0025;width:100\u0025;padding:6px 0 0 0 !important;background:none;color:#fff !important;font-family:\"lucida grande\", tahoma, verdana, arial, sans-serif !important;font-size:13px !important;font-style:normal !important;font-variant:normal !important;font-weight:normal !important;letter-spacing:normal !important;line-height:1 !important;text-decoration:none !important;text-indent:0 !important;text-shadow:none !important;text-transform:none !important;white-space:normal !important;word-spacing:normal !important}\n.gs_connect_bar a:hover{color:#fff}\n.gs_connect_bar .gs_profile img{height:30px;width:30px;vertical-align:middle;margin:0 6px 5px 0}\n.gs_connect_bar div a,\n.gs_connect_bar span,\n.gs_connect_bar span a{color:#bac6da;font-size:11px;text-decoration:none}\n.gs_connect_bar .gs_buttons{float:right;margin-top:7px}\n.gs_edge_widget_with_comment{position:relative;*z-index:1000}\n.gs_edge_widget_with_comment span.gs_edge_comment_widget{position:absolute}\n.gs_edge_widget_with_comment span.gs_edge_comment_widget iframe.gs_ltr{left:-4px}\n.gs_edge_widget_with_comment span.gs_edge_comment_widget iframe.gs_rtl{left:2px}\n.gs_edge_widget_with_comment span.gs_send_button_form_widget{left:0}\n.gs_edge_widget_with_comment span.gs_send_button_form_widget .GS_Loader{left:10\u0025}\n.gs_share_count_wrapper{position:relative;float:left}\n.gs_share_count{background:#b0b9ec none repeat scroll 0 0;color:#333;font-family:\"lucida grande\", tahoma, verdana, arial, sans-serif;text-align:center}\n.gs_share_count_inner{background:#e8ebf2;display:block}\n.gs_share_count_right{margin-left:-1px;display:inline-block}\n.gs_share_count_right .gs_share_count_inner{border-top:solid 1px #e8ebf2;border-bottom:solid 1px #b0b9ec;margin:1px 1px 0 1px;font-size:10px;line-height:10px;padding:2px 6px 3px;font-weight:bold}\n.gs_share_count_top{display:block;letter-spacing:-1px;line-height:34px;margin-bottom:7px;font-size:22px;border:solid 1px #b0b9ec}\n.gs_share_count_nub_top{border:none;display:block;position:absolute;left:7px;top:35px;margin:0;padding:0;width:6px;height:7px;background-repeat:no-repeat;background-image:url(http:\/\/static.gamescdn.com\/rsrc\/png\/zU-r-bSOHtKbCGYI.png)}\n.gs_share_count_nub_right{border:none;display:inline-block;padding:0;width:5px;height:10px;background-repeat:no-repeat;background-image:url(http:\/\/static.gamescdn.com\/rsrc\/png\/zX-r-i_oIVTKMYsL.png);vertical-align:top;background-position:right 5px;z-index:10;left:2px;margin:0 2px 0 0;position:relative}\n.gs_share_no_count{display:none}\n.gs_share_size_Small .gs_share_count_right .gs_share_count_inner{font-size:10px}\n.gs_share_size_Medium .gs_share_count_right .gs_share_count_inner{font-size:11px;padding:2px 6px 3px;letter-spacing:-1px;line-height:14px}\n.gs_share_size_Large .gs_share_count_right .gs_share_count_inner{font-size:13px;line-height:16px;padding:2px 6px 4px;font-weight:normal;letter-spacing:-1px}\n.gs_share_count_hidden .gs_share_count_nub_top,\n.gs_share_count_hidden .gs_share_count_top,\n.gs_share_count_hidden .gs_share_count_nub_right,\n.gs_share_count_hidden .gs_share_count_right{visibility:hidden}\n#gs_social_bar_container{position:fixed;left:0;right:0;height:34px;padding:0 25px;z-index:999999999}\n.gs_social_bar_iframe{position:relative;float:right;opacity:0;-moz-opacity:0;filter:alpha(opacity=0)}\n.gs_social_bar_iframe_bottom_ie6{bottom:auto;top:expression(eval(document.documentElement.scrollTop+document.documentElement.clientHeight-this.offsetHeight-(parseInt(this.currentStyle.marginTop,10)||0)-(parseInt(this.currentStyle.marginBottom,10)||0)))}\n.gs_social_bar_iframe_top_ie6{bottom:auto;top:expression(eval(document.documentElement.scrollTop-this.offsetHeight-(parseInt(this.currentStyle.marginTop,10)||0)-(parseInt(this.currentStyle.marginBottom,10)||0)))}\n .gs_dialog_content .dialog_title {background:url(https:\/\/s3.amazonaws.com\/static.gamescdn.com\/img\/bgSprite.png?1) repeat-x scroll 0 -124px #01A3C2; padding:10px; }.gs_dialog_content .dialog_title > span {background:url(http:\/\/static.gamescdn.com\/img\/favicon.png) no-repeat 0 50\u0025; padding:1px 0 1px 23px;} .gs_dialog_content .dialog_title, .gs_dialog_content .dialog_content {border:0;} .gs_dialog_content .dialog_footer { border-left-width:0; border-right-width:0;}", ["gs.css.base", "gs.css.dialog", "gs.css.iframewidget", "gs.css.button", "gs.css.connectbarwidget", "gs.css.edgecommentwidget", "gs.css.sendbuttonformwidget", "gs.css.sharebutton", "gs.css.socialbarwidget"]);
}