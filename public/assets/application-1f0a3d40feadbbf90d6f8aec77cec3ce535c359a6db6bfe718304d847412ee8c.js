/*
Unobtrusive JavaScript
https://github.com/rails/rails/blob/master/actionview/app/assets/javascripts
Released under the MIT license
 */


(function() {
  var context = this;

  (function() {
    (function() {
      this.Rails = {
        linkClickSelector: 'a[data-confirm], a[data-method], a[data-remote]:not([disabled]), a[data-disable-with], a[data-disable]',
        buttonClickSelector: {
          selector: 'button[data-remote]:not([form]), button[data-confirm]:not([form])',
          exclude: 'form button'
        },
        inputChangeSelector: 'select[data-remote], input[data-remote], textarea[data-remote]',
        formSubmitSelector: 'form',
        formInputClickSelector: 'form input[type=submit], form input[type=image], form button[type=submit], form button:not([type]), input[type=submit][form], input[type=image][form], button[type=submit][form], button[form]:not([type])',
        formDisableSelector: 'input[data-disable-with]:enabled, button[data-disable-with]:enabled, textarea[data-disable-with]:enabled, input[data-disable]:enabled, button[data-disable]:enabled, textarea[data-disable]:enabled',
        formEnableSelector: 'input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled, input[data-disable]:disabled, button[data-disable]:disabled, textarea[data-disable]:disabled',
        fileInputSelector: 'input[name][type=file]:not([disabled])',
        linkDisableSelector: 'a[data-disable-with], a[data-disable]',
        buttonDisableSelector: 'button[data-remote][data-disable-with], button[data-remote][data-disable]'
      };

    }).call(this);
  }).call(context);

  var Rails = context.Rails;

  (function() {
    (function() {
      var expando, m;

      m = Element.prototype.matches || Element.prototype.matchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.oMatchesSelector || Element.prototype.webkitMatchesSelector;

      Rails.matches = function(element, selector) {
        if (selector.exclude != null) {
          return m.call(element, selector.selector) && !m.call(element, selector.exclude);
        } else {
          return m.call(element, selector);
        }
      };

      expando = '_ujsData';

      Rails.getData = function(element, key) {
        var ref;
        return (ref = element[expando]) != null ? ref[key] : void 0;
      };

      Rails.setData = function(element, key, value) {
        if (element[expando] == null) {
          element[expando] = {};
        }
        return element[expando][key] = value;
      };

      Rails.$ = function(selector) {
        return Array.prototype.slice.call(document.querySelectorAll(selector));
      };

    }).call(this);
    (function() {
      var $, csrfParam, csrfToken;

      $ = Rails.$;

      csrfToken = Rails.csrfToken = function() {
        var meta;
        meta = document.querySelector('meta[name=csrf-token]');
        return meta && meta.content;
      };

      csrfParam = Rails.csrfParam = function() {
        var meta;
        meta = document.querySelector('meta[name=csrf-param]');
        return meta && meta.content;
      };

      Rails.CSRFProtection = function(xhr) {
        var token;
        token = csrfToken();
        if (token != null) {
          return xhr.setRequestHeader('X-CSRF-Token', token);
        }
      };

      Rails.refreshCSRFTokens = function() {
        var param, token;
        token = csrfToken();
        param = csrfParam();
        if ((token != null) && (param != null)) {
          return $('form input[name="' + param + '"]').forEach(function(input) {
            return input.value = token;
          });
        }
      };

    }).call(this);
    (function() {
      var CustomEvent, fire, matches;

      matches = Rails.matches;

      CustomEvent = window.CustomEvent;

      if (typeof CustomEvent !== 'function') {
        CustomEvent = function(event, params) {
          var evt;
          evt = document.createEvent('CustomEvent');
          evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
          return evt;
        };
        CustomEvent.prototype = window.Event.prototype;
      }

      fire = Rails.fire = function(obj, name, data) {
        var event;
        event = new CustomEvent(name, {
          bubbles: true,
          cancelable: true,
          detail: data
        });
        obj.dispatchEvent(event);
        return !event.defaultPrevented;
      };

      Rails.stopEverything = function(e) {
        fire(e.target, 'ujs:everythingStopped');
        e.preventDefault();
        e.stopPropagation();
        return e.stopImmediatePropagation();
      };

      Rails.delegate = function(element, selector, eventType, handler) {
        return element.addEventListener(eventType, function(e) {
          var target;
          target = e.target;
          while (!(!(target instanceof Element) || matches(target, selector))) {
            target = target.parentNode;
          }
          if (target instanceof Element && handler.call(target, e) === false) {
            e.preventDefault();
            return e.stopPropagation();
          }
        });
      };

    }).call(this);
    (function() {
      var AcceptHeaders, CSRFProtection, createXHR, fire, prepareOptions, processResponse;

      CSRFProtection = Rails.CSRFProtection, fire = Rails.fire;

      AcceptHeaders = {
        '*': '*/*',
        text: 'text/plain',
        html: 'text/html',
        xml: 'application/xml, text/xml',
        json: 'application/json, text/javascript',
        script: 'text/javascript, application/javascript, application/ecmascript, application/x-ecmascript'
      };

      Rails.ajax = function(options) {
        var xhr;
        options = prepareOptions(options);
        xhr = createXHR(options, function() {
          var response;
          response = processResponse(xhr.response, xhr.getResponseHeader('Content-Type'));
          if (Math.floor(xhr.status / 100) === 2) {
            if (typeof options.success === "function") {
              options.success(response, xhr.statusText, xhr);
            }
          } else {
            if (typeof options.error === "function") {
              options.error(response, xhr.statusText, xhr);
            }
          }
          return typeof options.complete === "function" ? options.complete(xhr, xhr.statusText) : void 0;
        });
        if (typeof options.beforeSend === "function") {
          options.beforeSend(xhr, options);
        }
        if (xhr.readyState === XMLHttpRequest.OPENED) {
          return xhr.send(options.data);
        } else {
          return fire(document, 'ajaxStop');
        }
      };

      prepareOptions = function(options) {
        options.url = options.url || location.href;
        options.type = options.type.toUpperCase();
        if (options.type === 'GET' && options.data) {
          if (options.url.indexOf('?') < 0) {
            options.url += '?' + options.data;
          } else {
            options.url += '&' + options.data;
          }
        }
        if (AcceptHeaders[options.dataType] == null) {
          options.dataType = '*';
        }
        options.accept = AcceptHeaders[options.dataType];
        if (options.dataType !== '*') {
          options.accept += ', */*; q=0.01';
        }
        return options;
      };

      createXHR = function(options, done) {
        var xhr;
        xhr = new XMLHttpRequest();
        xhr.open(options.type, options.url, true);
        xhr.setRequestHeader('Accept', options.accept);
        if (typeof options.data === 'string') {
          xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        }
        if (!options.crossDomain) {
          xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        }
        CSRFProtection(xhr);
        xhr.withCredentials = !!options.withCredentials;
        xhr.onreadystatechange = function() {
          if (xhr.readyState === XMLHttpRequest.DONE) {
            return done(xhr);
          }
        };
        return xhr;
      };

      processResponse = function(response, type) {
        var parser, script;
        if (typeof response === 'string' && typeof type === 'string') {
          if (type.match(/\bjson\b/)) {
            try {
              response = JSON.parse(response);
            } catch (error) {}
          } else if (type.match(/\b(?:java|ecma)script\b/)) {
            script = document.createElement('script');
            script.text = response;
            document.head.appendChild(script).parentNode.removeChild(script);
          } else if (type.match(/\b(xml|html|svg)\b/)) {
            parser = new DOMParser();
            type = type.replace(/;.+/, '');
            try {
              response = parser.parseFromString(response, type);
            } catch (error) {}
          }
        }
        return response;
      };

      Rails.href = function(element) {
        return element.href;
      };

      Rails.isCrossDomain = function(url) {
        var e, originAnchor, urlAnchor;
        originAnchor = document.createElement('a');
        originAnchor.href = location.href;
        urlAnchor = document.createElement('a');
        try {
          urlAnchor.href = url;
          return !(((!urlAnchor.protocol || urlAnchor.protocol === ':') && !urlAnchor.host) || (originAnchor.protocol + '//' + originAnchor.host === urlAnchor.protocol + '//' + urlAnchor.host));
        } catch (error) {
          e = error;
          return true;
        }
      };

    }).call(this);
    (function() {
      var matches, toArray;

      matches = Rails.matches;

      toArray = function(e) {
        return Array.prototype.slice.call(e);
      };

      Rails.serializeElement = function(element, additionalParam) {
        var inputs, params;
        inputs = [element];
        if (matches(element, 'form')) {
          inputs = toArray(element.elements);
        }
        params = [];
        inputs.forEach(function(input) {
          if (!input.name) {
            return;
          }
          if (matches(input, 'select')) {
            return toArray(input.options).forEach(function(option) {
              if (option.selected) {
                return params.push({
                  name: input.name,
                  value: option.value
                });
              }
            });
          } else if (input.checked || ['radio', 'checkbox', 'submit'].indexOf(input.type) === -1) {
            return params.push({
              name: input.name,
              value: input.value
            });
          }
        });
        if (additionalParam) {
          params.push(additionalParam);
        }
        return params.map(function(param) {
          if (param.name != null) {
            return (encodeURIComponent(param.name)) + "=" + (encodeURIComponent(param.value));
          } else {
            return param;
          }
        }).join('&');
      };

      Rails.formElements = function(form, selector) {
        if (matches(form, 'form')) {
          return toArray(form.elements).filter(function(el) {
            return matches(el, selector);
          });
        } else {
          return toArray(form.querySelectorAll(selector));
        }
      };

    }).call(this);
    (function() {
      var allowAction, fire, stopEverything;

      fire = Rails.fire, stopEverything = Rails.stopEverything;

      Rails.handleConfirm = function(e) {
        if (!allowAction(this)) {
          return stopEverything(e);
        }
      };

      allowAction = function(element) {
        var answer, callback, message;
        message = element.getAttribute('data-confirm');
        if (!message) {
          return true;
        }
        answer = false;
        if (fire(element, 'confirm')) {
          try {
            answer = confirm(message);
          } catch (error) {}
          callback = fire(element, 'confirm:complete', [answer]);
        }
        return answer && callback;
      };

    }).call(this);
    (function() {
      var disableFormElement, disableFormElements, disableLinkElement, enableFormElement, enableFormElements, enableLinkElement, formElements, getData, matches, setData, stopEverything;

      matches = Rails.matches, getData = Rails.getData, setData = Rails.setData, stopEverything = Rails.stopEverything, formElements = Rails.formElements;

      Rails.handleDisabledElement = function(e) {
        var element;
        element = this;
        if (element.disabled) {
          return stopEverything(e);
        }
      };

      Rails.enableElement = function(e) {
        var element;
        element = e instanceof Event ? e.target : e;
        if (matches(element, Rails.linkDisableSelector)) {
          return enableLinkElement(element);
        } else if (matches(element, Rails.buttonDisableSelector) || matches(element, Rails.formEnableSelector)) {
          return enableFormElement(element);
        } else if (matches(element, Rails.formSubmitSelector)) {
          return enableFormElements(element);
        }
      };

      Rails.disableElement = function(e) {
        var element;
        element = e instanceof Event ? e.target : e;
        if (matches(element, Rails.linkDisableSelector)) {
          return disableLinkElement(element);
        } else if (matches(element, Rails.buttonDisableSelector) || matches(element, Rails.formDisableSelector)) {
          return disableFormElement(element);
        } else if (matches(element, Rails.formSubmitSelector)) {
          return disableFormElements(element);
        }
      };

      disableLinkElement = function(element) {
        var replacement;
        replacement = element.getAttribute('data-disable-with');
        if (replacement != null) {
          setData(element, 'ujs:enable-with', element.innerHTML);
          element.innerHTML = replacement;
        }
        element.addEventListener('click', stopEverything);
        return setData(element, 'ujs:disabled', true);
      };

      enableLinkElement = function(element) {
        var originalText;
        originalText = getData(element, 'ujs:enable-with');
        if (originalText != null) {
          element.innerHTML = originalText;
          setData(element, 'ujs:enable-with', null);
        }
        element.removeEventListener('click', stopEverything);
        return setData(element, 'ujs:disabled', null);
      };

      disableFormElements = function(form) {
        return formElements(form, Rails.formDisableSelector).forEach(disableFormElement);
      };

      disableFormElement = function(element) {
        var replacement;
        replacement = element.getAttribute('data-disable-with');
        if (replacement != null) {
          if (matches(element, 'button')) {
            setData(element, 'ujs:enable-with', element.innerHTML);
            element.innerHTML = replacement;
          } else {
            setData(element, 'ujs:enable-with', element.value);
            element.value = replacement;
          }
        }
        element.disabled = true;
        return setData(element, 'ujs:disabled', true);
      };

      enableFormElements = function(form) {
        return formElements(form, Rails.formEnableSelector).forEach(enableFormElement);
      };

      enableFormElement = function(element) {
        var originalText;
        originalText = getData(element, 'ujs:enable-with');
        if (originalText != null) {
          if (matches(element, 'button')) {
            element.innerHTML = originalText;
          } else {
            element.value = originalText;
          }
          setData(element, 'ujs:enable-with', null);
        }
        element.disabled = false;
        return setData(element, 'ujs:disabled', null);
      };

    }).call(this);
    (function() {
      var stopEverything;

      stopEverything = Rails.stopEverything;

      Rails.handleMethod = function(e) {
        var csrfParam, csrfToken, form, formContent, href, link, method;
        link = this;
        method = link.getAttribute('data-method');
        if (!method) {
          return;
        }
        href = Rails.href(link);
        csrfToken = Rails.csrfToken();
        csrfParam = Rails.csrfParam();
        form = document.createElement('form');
        formContent = "<input name='_method' value='" + method + "' type='hidden' />";
        if ((csrfParam != null) && (csrfToken != null) && !Rails.isCrossDomain(href)) {
          formContent += "<input name='" + csrfParam + "' value='" + csrfToken + "' type='hidden' />";
        }
        formContent += '<input type="submit" />';
        form.method = 'post';
        form.action = href;
        form.target = link.target;
        form.innerHTML = formContent;
        form.style.display = 'none';
        document.body.appendChild(form);
        form.querySelector('[type="submit"]').click();
        return stopEverything(e);
      };

    }).call(this);
    (function() {
      var ajax, fire, getData, isCrossDomain, isRemote, matches, serializeElement, setData, stopEverything,
        slice = [].slice;

      matches = Rails.matches, getData = Rails.getData, setData = Rails.setData, fire = Rails.fire, stopEverything = Rails.stopEverything, ajax = Rails.ajax, isCrossDomain = Rails.isCrossDomain, serializeElement = Rails.serializeElement;

      isRemote = function(element) {
        var value;
        value = element.getAttribute('data-remote');
        return (value != null) && value !== 'false';
      };

      Rails.handleRemote = function(e) {
        var button, data, dataType, element, method, url, withCredentials;
        element = this;
        if (!isRemote(element)) {
          return true;
        }
        if (!fire(element, 'ajax:before')) {
          fire(element, 'ajax:stopped');
          return false;
        }
        withCredentials = element.getAttribute('data-with-credentials');
        dataType = element.getAttribute('data-type') || 'script';
        if (matches(element, Rails.formSubmitSelector)) {
          button = getData(element, 'ujs:submit-button');
          method = getData(element, 'ujs:submit-button-formmethod') || element.method;
          url = getData(element, 'ujs:submit-button-formaction') || element.getAttribute('action') || location.href;
          if (method.toUpperCase() === 'GET') {
            url = url.replace(/\?.*$/, '');
          }
          if (element.enctype === 'multipart/form-data') {
            data = new FormData(element);
            if (button != null) {
              data.append(button.name, button.value);
            }
          } else {
            data = serializeElement(element, button);
          }
          setData(element, 'ujs:submit-button', null);
          setData(element, 'ujs:submit-button-formmethod', null);
          setData(element, 'ujs:submit-button-formaction', null);
        } else if (matches(element, Rails.buttonClickSelector) || matches(element, Rails.inputChangeSelector)) {
          method = element.getAttribute('data-method');
          url = element.getAttribute('data-url');
          data = serializeElement(element, element.getAttribute('data-params'));
        } else {
          method = element.getAttribute('data-method');
          url = Rails.href(element);
          data = element.getAttribute('data-params');
        }
        ajax({
          type: method || 'GET',
          url: url,
          data: data,
          dataType: dataType,
          beforeSend: function(xhr, options) {
            if (fire(element, 'ajax:beforeSend', [xhr, options])) {
              return fire(element, 'ajax:send', [xhr]);
            } else {
              fire(element, 'ajax:stopped');
              return xhr.abort();
            }
          },
          success: function() {
            var args;
            args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
            return fire(element, 'ajax:success', args);
          },
          error: function() {
            var args;
            args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
            return fire(element, 'ajax:error', args);
          },
          complete: function() {
            var args;
            args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
            return fire(element, 'ajax:complete', args);
          },
          crossDomain: isCrossDomain(url),
          withCredentials: (withCredentials != null) && withCredentials !== 'false'
        });
        return stopEverything(e);
      };

      Rails.formSubmitButtonClick = function(e) {
        var button, form;
        button = this;
        form = button.form;
        if (!form) {
          return;
        }
        if (button.name) {
          setData(form, 'ujs:submit-button', {
            name: button.name,
            value: button.value
          });
        }
        setData(form, 'ujs:formnovalidate-button', button.formNoValidate);
        setData(form, 'ujs:submit-button-formaction', button.getAttribute('formaction'));
        return setData(form, 'ujs:submit-button-formmethod', button.getAttribute('formmethod'));
      };

      Rails.handleMetaClick = function(e) {
        var data, link, metaClick, method;
        link = this;
        method = (link.getAttribute('data-method') || 'GET').toUpperCase();
        data = link.getAttribute('data-params');
        metaClick = e.metaKey || e.ctrlKey;
        if (metaClick && method === 'GET' && !data) {
          return e.stopImmediatePropagation();
        }
      };

    }).call(this);
    (function() {
      var $, CSRFProtection, delegate, disableElement, enableElement, fire, formSubmitButtonClick, getData, handleConfirm, handleDisabledElement, handleMetaClick, handleMethod, handleRemote, refreshCSRFTokens;

      fire = Rails.fire, delegate = Rails.delegate, getData = Rails.getData, $ = Rails.$, refreshCSRFTokens = Rails.refreshCSRFTokens, CSRFProtection = Rails.CSRFProtection, enableElement = Rails.enableElement, disableElement = Rails.disableElement, handleDisabledElement = Rails.handleDisabledElement, handleConfirm = Rails.handleConfirm, handleRemote = Rails.handleRemote, formSubmitButtonClick = Rails.formSubmitButtonClick, handleMetaClick = Rails.handleMetaClick, handleMethod = Rails.handleMethod;

      if ((typeof jQuery !== "undefined" && jQuery !== null) && (jQuery.ajax != null) && !jQuery.rails) {
        jQuery.rails = Rails;
        jQuery.ajaxPrefilter(function(options, originalOptions, xhr) {
          if (!options.crossDomain) {
            return CSRFProtection(xhr);
          }
        });
      }

      Rails.start = function() {
        if (window._rails_loaded) {
          throw new Error('rails-ujs has already been loaded!');
        }
        window.addEventListener('pageshow', function() {
          $(Rails.formEnableSelector).forEach(function(el) {
            if (getData(el, 'ujs:disabled')) {
              return enableElement(el);
            }
          });
          return $(Rails.linkDisableSelector).forEach(function(el) {
            if (getData(el, 'ujs:disabled')) {
              return enableElement(el);
            }
          });
        });
        delegate(document, Rails.linkDisableSelector, 'ajax:complete', enableElement);
        delegate(document, Rails.linkDisableSelector, 'ajax:stopped', enableElement);
        delegate(document, Rails.buttonDisableSelector, 'ajax:complete', enableElement);
        delegate(document, Rails.buttonDisableSelector, 'ajax:stopped', enableElement);
        delegate(document, Rails.linkClickSelector, 'click', handleDisabledElement);
        delegate(document, Rails.linkClickSelector, 'click', handleConfirm);
        delegate(document, Rails.linkClickSelector, 'click', handleMetaClick);
        delegate(document, Rails.linkClickSelector, 'click', disableElement);
        delegate(document, Rails.linkClickSelector, 'click', handleRemote);
        delegate(document, Rails.linkClickSelector, 'click', handleMethod);
        delegate(document, Rails.buttonClickSelector, 'click', handleDisabledElement);
        delegate(document, Rails.buttonClickSelector, 'click', handleConfirm);
        delegate(document, Rails.buttonClickSelector, 'click', disableElement);
        delegate(document, Rails.buttonClickSelector, 'click', handleRemote);
        delegate(document, Rails.inputChangeSelector, 'change', handleDisabledElement);
        delegate(document, Rails.inputChangeSelector, 'change', handleConfirm);
        delegate(document, Rails.inputChangeSelector, 'change', handleRemote);
        delegate(document, Rails.formSubmitSelector, 'submit', handleDisabledElement);
        delegate(document, Rails.formSubmitSelector, 'submit', handleConfirm);
        delegate(document, Rails.formSubmitSelector, 'submit', handleRemote);
        delegate(document, Rails.formSubmitSelector, 'submit', function(e) {
          return setTimeout((function() {
            return disableElement(e);
          }), 13);
        });
        delegate(document, Rails.formSubmitSelector, 'ajax:send', disableElement);
        delegate(document, Rails.formSubmitSelector, 'ajax:complete', enableElement);
        delegate(document, Rails.formInputClickSelector, 'click', handleDisabledElement);
        delegate(document, Rails.formInputClickSelector, 'click', handleConfirm);
        delegate(document, Rails.formInputClickSelector, 'click', formSubmitButtonClick);
        document.addEventListener('DOMContentLoaded', refreshCSRFTokens);
        return window._rails_loaded = true;
      };

      if (window.Rails === Rails && fire(document, 'rails:attachBindings')) {
        Rails.start();
      }

    }).call(this);
  }).call(this);

  if (typeof module === "object" && module.exports) {
    module.exports = Rails;
  } else if (typeof define === "function" && define.amd) {
    define(Rails);
  }
}).call(this);
/*!
 * jQuery JavaScript Library v1.12.4
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2016-05-20T17:17Z
 */


(function( global, factory ) {

	if ( typeof module === "object" && typeof module.exports === "object" ) {
		// For CommonJS and CommonJS-like environments where a proper `window`
		// is present, execute the factory and get jQuery.
		// For environments that do not have a `window` with a `document`
		// (such as Node.js), expose a factory as module.exports.
		// This accentuates the need for the creation of a real `window`.
		// e.g. var jQuery = require("jquery")(window);
		// See ticket #14549 for more info.
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "jQuery requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}

// Pass this if window is not defined yet
}(typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

// Support: Firefox 18+
// Can't be in strict mode, several libs including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
//"use strict";
var deletedIds = [];

var document = window.document;

var slice = deletedIds.slice;

var concat = deletedIds.concat;

var push = deletedIds.push;

var indexOf = deletedIds.indexOf;

var class2type = {};

var toString = class2type.toString;

var hasOwn = class2type.hasOwnProperty;

var support = {};



var
	version = "1.12.4",

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {

		// The jQuery object is actually just the init constructor 'enhanced'
		// Need init if jQuery is called (just allow error to be thrown if not included)
		return new jQuery.fn.init( selector, context );
	},

	// Support: Android<4.1, IE<9
	// Make sure we trim BOM and NBSP
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	};

jQuery.fn = jQuery.prototype = {

	// The current version of jQuery being used
	jquery: version,

	constructor: jQuery,

	// Start with an empty selector
	selector: "",

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num != null ?

			// Return just the one element from the set
			( num < 0 ? this[ num + this.length ] : this[ num ] ) :

			// Return all the elements in a clean array
			slice.call( this );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;
		ret.context = this.context;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	each: function( callback ) {
		return jQuery.each( this, callback );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map( this, function( elem, i ) {
			return callback.call( elem, i, elem );
		} ) );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
	},

	end: function() {
		return this.prevObject || this.constructor();
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: deletedIds.sort,
	splice: deletedIds.splice
};

jQuery.extend = jQuery.fn.extend = function() {
	var src, copyIsArray, copy, name, options, clone,
		target = arguments[ 0 ] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;

		// skip the boolean and the target
		target = arguments[ i ] || {};
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction( target ) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( i === length ) {
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {

		// Only deal with non-null/undefined values
		if ( ( options = arguments[ i ] ) != null ) {

			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
					( copyIsArray = jQuery.isArray( copy ) ) ) ) {

					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray( src ) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject( src ) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend( {

	// Unique for each copy of jQuery on the page
	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

	// Assume jQuery is ready without the ready module
	isReady: true,

	error: function( msg ) {
		throw new Error( msg );
	},

	noop: function() {},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type( obj ) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type( obj ) === "array";
	},

	isWindow: function( obj ) {
		/* jshint eqeqeq: false */
		return obj != null && obj == obj.window;
	},

	isNumeric: function( obj ) {

		// parseFloat NaNs numeric-cast false positives (null|true|false|"")
		// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
		// subtraction forces infinities to NaN
		// adding 1 corrects loss of precision from parseFloat (#15100)
		var realStringObj = obj && obj.toString();
		return !jQuery.isArray( obj ) && ( realStringObj - parseFloat( realStringObj ) + 1 ) >= 0;
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	isPlainObject: function( obj ) {
		var key;

		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type( obj ) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {

			// Not own constructor property must be Object
			if ( obj.constructor &&
				!hasOwn.call( obj, "constructor" ) &&
				!hasOwn.call( obj.constructor.prototype, "isPrototypeOf" ) ) {
				return false;
			}
		} catch ( e ) {

			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Support: IE<9
		// Handle iteration over inherited properties before own properties.
		if ( !support.ownFirst ) {
			for ( key in obj ) {
				return hasOwn.call( obj, key );
			}
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.
		for ( key in obj ) {}

		return key === undefined || hasOwn.call( obj, key );
	},

	type: function( obj ) {
		if ( obj == null ) {
			return obj + "";
		}
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ toString.call( obj ) ] || "object" :
			typeof obj;
	},

	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && jQuery.trim( data ) ) {

			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data ); // jscs:ignore requireDotNotation
			} )( data );
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	each: function( obj, callback ) {
		var length, i = 0;

		if ( isArrayLike( obj ) ) {
			length = obj.length;
			for ( ; i < length; i++ ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		} else {
			for ( i in obj ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		}

		return obj;
	},

	// Support: Android<4.1, IE<9
	trim: function( text ) {
		return text == null ?
			"" :
			( text + "" ).replace( rtrim, "" );
	},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArrayLike( Object( arr ) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		var len;

		if ( arr ) {
			if ( indexOf ) {
				return indexOf.call( arr, elem, i );
			}

			len = arr.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {

				// Skip accessing in sparse arrays
				if ( i in arr && arr[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var len = +second.length,
			j = 0,
			i = first.length;

		while ( j < len ) {
			first[ i++ ] = second[ j++ ];
		}

		// Support: IE<9
		// Workaround casting of .length to NaN on otherwise arraylike objects (e.g., NodeLists)
		if ( len !== len ) {
			while ( second[ j ] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, invert ) {
		var callbackInverse,
			matches = [],
			i = 0,
			length = elems.length,
			callbackExpect = !invert;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			callbackInverse = !callback( elems[ i ], i );
			if ( callbackInverse !== callbackExpect ) {
				matches.push( elems[ i ] );
			}
		}

		return matches;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var length, value,
			i = 0,
			ret = [];

		// Go through the array, translating each of the items to their new values
		if ( isArrayLike( elems ) ) {
			length = elems.length;
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}
		}

		// Flatten any nested arrays
		return concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var args, proxy, tmp;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	now: function() {
		return +( new Date() );
	},

	// jQuery.support is not used in Core but other projects attach their
	// properties to it so it needs to exist.
	support: support
} );

// JSHint would error on this code due to the Symbol not being defined in ES5.
// Defining this global in .jshintrc would create a danger of using the global
// unguarded in another place, it seems safer to just disable JSHint for these
// three lines.
/* jshint ignore: start */
if ( typeof Symbol === "function" ) {
	jQuery.fn[ Symbol.iterator ] = deletedIds[ Symbol.iterator ];
}
/* jshint ignore: end */

// Populate the class2type map
jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
function( i, name ) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
} );

function isArrayLike( obj ) {

	// Support: iOS 8.2 (not reproducible in simulator)
	// `in` check used to prevent JIT error (gh-2145)
	// hasOwn isn't used here due to false negatives
	// regarding Nodelist length in IE
	var length = !!obj && "length" in obj && obj.length,
		type = jQuery.type( obj );

	if ( type === "function" || jQuery.isWindow( obj ) ) {
		return false;
	}

	return type === "array" || length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}
var Sizzle =
/*!
 * Sizzle CSS Selector Engine v2.2.1
 * http://sizzlejs.com/
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2015-10-17
 */
(function( window ) {

var i,
	support,
	Expr,
	getText,
	isXML,
	tokenize,
	compile,
	select,
	outermostContext,
	sortInput,
	hasDuplicate,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + 1 * new Date(),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
		}
		return 0;
	},

	// General-purpose constants
	MAX_NEGATIVE = 1 << 31,

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf as it's faster than native
	// http://jsperf.com/thor-indexof-vs-for/5
	indexOf = function( list, elem ) {
		var i = 0,
			len = list.length;
		for ( ; i < len; i++ ) {
			if ( list[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",

	// http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

	// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +
		// Operator (capture 2)
		"*([*^$|!~]?=)" + whitespace +
		// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
		"*\\]",

	pseudos = ":(" + identifier + ")(?:\\((" +
		// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
		// 1. quoted (capture 3; capture 4 or capture 5)
		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
		// 2. simple (capture 6)
		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
		// 3. anything else (capture 2)
		".*" +
		")\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rwhitespace = new RegExp( whitespace + "+", "g" ),
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + identifier + ")" ),
		"CLASS": new RegExp( "^\\.(" + identifier + ")" ),
		"TAG": new RegExp( "^(" + identifier + "|[*])" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rsibling = /[+~]/,
	rescape = /'|\\/g,

	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox<24
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			high < 0 ?
				// BMP codepoint
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	},

	// Used for iframes
	// See setDocument()
	// Removing the function wrapper causes a "Permission Denied"
	// error in IE
	unloadHandler = function() {
		setDocument();
	};

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var m, i, elem, nid, nidselect, match, groups, newSelector,
		newContext = context && context.ownerDocument,

		// nodeType defaults to 9, since context defaults to document
		nodeType = context ? context.nodeType : 9;

	results = results || [];

	// Return early from calls with invalid selector or context
	if ( typeof selector !== "string" || !selector ||
		nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {

		return results;
	}

	// Try to shortcut find operations (as opposed to filters) in HTML documents
	if ( !seed ) {

		if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
			setDocument( context );
		}
		context = context || document;

		if ( documentIsHTML ) {

			// If the selector is sufficiently simple, try using a "get*By*" DOM method
			// (excepting DocumentFragment context, where the methods don't exist)
			if ( nodeType !== 11 && (match = rquickExpr.exec( selector )) ) {

				// ID selector
				if ( (m = match[1]) ) {

					// Document context
					if ( nodeType === 9 ) {
						if ( (elem = context.getElementById( m )) ) {

							// Support: IE, Opera, Webkit
							// TODO: identify versions
							// getElementById can match elements by name instead of ID
							if ( elem.id === m ) {
								results.push( elem );
								return results;
							}
						} else {
							return results;
						}

					// Element context
					} else {

						// Support: IE, Opera, Webkit
						// TODO: identify versions
						// getElementById can match elements by name instead of ID
						if ( newContext && (elem = newContext.getElementById( m )) &&
							contains( context, elem ) &&
							elem.id === m ) {

							results.push( elem );
							return results;
						}
					}

				// Type selector
				} else if ( match[2] ) {
					push.apply( results, context.getElementsByTagName( selector ) );
					return results;

				// Class selector
				} else if ( (m = match[3]) && support.getElementsByClassName &&
					context.getElementsByClassName ) {

					push.apply( results, context.getElementsByClassName( m ) );
					return results;
				}
			}

			// Take advantage of querySelectorAll
			if ( support.qsa &&
				!compilerCache[ selector + " " ] &&
				(!rbuggyQSA || !rbuggyQSA.test( selector )) ) {

				if ( nodeType !== 1 ) {
					newContext = context;
					newSelector = selector;

				// qSA looks outside Element context, which is not what we want
				// Thanks to Andrew Dupont for this workaround technique
				// Support: IE <=8
				// Exclude object elements
				} else if ( context.nodeName.toLowerCase() !== "object" ) {

					// Capture the context ID, setting it first if necessary
					if ( (nid = context.getAttribute( "id" )) ) {
						nid = nid.replace( rescape, "\\$&" );
					} else {
						context.setAttribute( "id", (nid = expando) );
					}

					// Prefix every selector in the list
					groups = tokenize( selector );
					i = groups.length;
					nidselect = ridentifier.test( nid ) ? "#" + nid : "[id='" + nid + "']";
					while ( i-- ) {
						groups[i] = nidselect + " " + toSelector( groups[i] );
					}
					newSelector = groups.join( "," );

					// Expand context for sibling selectors
					newContext = rsibling.test( selector ) && testContext( context.parentNode ) ||
						context;
				}

				if ( newSelector ) {
					try {
						push.apply( results,
							newContext.querySelectorAll( newSelector )
						);
						return results;
					} catch ( qsaError ) {
					} finally {
						if ( nid === expando ) {
							context.removeAttribute( "id" );
						}
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {function(string, object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key + " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key + " " ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
	var div = document.createElement("div");

	try {
		return !!fn( div );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( div.parentNode ) {
			div.parentNode.removeChild( div );
		}
		// release memory in IE
		div = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = arr.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			( ~b.sourceIndex || MAX_NEGATIVE ) -
			( ~a.sourceIndex || MAX_NEGATIVE );

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Checks a node for validity as a Sizzle context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
function testContext( context ) {
	return context && typeof context.getElementsByTagName !== "undefined" && context;
}

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Detects XML nodes
 * @param {Element|Object} elem An element or a document
 * @returns {Boolean} True iff elem is a non-HTML XML node
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var hasCompare, parent,
		doc = node ? node.ownerDocument || node : preferredDoc;

	// Return early if doc is invalid or already selected
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Update global variables
	document = doc;
	docElem = document.documentElement;
	documentIsHTML = !isXML( document );

	// Support: IE 9-11, Edge
	// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
	if ( (parent = document.defaultView) && parent.top !== parent ) {
		// Support: IE 11
		if ( parent.addEventListener ) {
			parent.addEventListener( "unload", unloadHandler, false );

		// Support: IE 9 - 10 only
		} else if ( parent.attachEvent ) {
			parent.attachEvent( "onunload", unloadHandler );
		}
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties
	// (excepting IE8 booleans)
	support.attributes = assert(function( div ) {
		div.className = "i";
		return !div.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( div ) {
		div.appendChild( document.createComment("") );
		return !div.getElementsByTagName("*").length;
	});

	// Support: IE<9
	support.getElementsByClassName = rnative.test( document.getElementsByClassName );

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( div ) {
		docElem.appendChild( div ).id = expando;
		return !document.getElementsByName || !document.getElementsByName( expando ).length;
	});

	// ID find and filter
	if ( support.getById ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var m = context.getElementById( id );
				return m ? [ m ] : [];
			}
		};
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
	} else {
		// Support: IE6/7
		// getElementById is not reliable as a find shortcut
		delete Expr.find["ID"];

		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== "undefined" &&
					elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( tag );

			// DocumentFragment nodes don't have gEBTN
			} else if ( support.qsa ) {
				return context.querySelectorAll( tag );
			}
		} :

		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See http://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( document.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			docElem.appendChild( div ).innerHTML = "<a id='" + expando + "'></a>" +
				"<select id='" + expando + "-\r\\' msallowcapture=''>" +
				"<option selected=''></option></select>";

			// Support: IE8, Opera 11-12.16
			// Nothing should be selected when empty strings follow ^= or $= or *=
			// The test attribute must be unknown in Opera but "safe" for WinRT
			// http://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
			if ( div.querySelectorAll("[msallowcapture^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
			if ( !div.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
				rbuggyQSA.push("~=");
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}

			// Support: Safari 8+, iOS 8+
			// https://bugs.webkit.org/show_bug.cgi?id=136851
			// In-page `selector#id sibing-combinator selector` fails
			if ( !div.querySelectorAll( "a#" + expando + "+*" ).length ) {
				rbuggyQSA.push(".#.+[+~]");
			}
		});

		assert(function( div ) {
			// Support: Windows 8 Native Apps
			// The type and name attributes are restricted during .innerHTML assignment
			var input = document.createElement("input");
			input.setAttribute( "type", "hidden" );
			div.appendChild( input ).setAttribute( "name", "D" );

			// Support: IE8
			// Enforce case-sensitivity of name attribute
			if ( div.querySelectorAll("[name=d]").length ) {
				rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			div.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.matches ||
		docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( div ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( div, "div" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( div, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */
	hasCompare = rnative.test( docElem.compareDocumentPosition );

	// Element contains another
	// Purposefully self-exclusive
	// As in, an element does not contain itself
	contains = hasCompare || rnative.test( docElem.contains ) ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = hasCompare ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		// Sort on method existence if only one input has compareDocumentPosition
		var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
		if ( compare ) {
			return compare;
		}

		// Calculate position if both inputs belong to the same document
		compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
			a.compareDocumentPosition( b ) :

			// Otherwise we know they are disconnected
			1;

		// Disconnected nodes
		if ( compare & 1 ||
			(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

			// Choose the first element that is related to our preferred document
			if ( a === document || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ) {
				return -1;
			}
			if ( b === document || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ) {
				return 1;
			}

			// Maintain original order
			return sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;
		}

		return compare & 4 ? -1 : 1;
	} :
	function( a, b ) {
		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Parentless nodes are either documents or disconnected
		if ( !aup || !bup ) {
			return a === document ? -1 :
				b === document ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return document;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		!compilerCache[ expr + " " ] &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch (e) {}
	}

	return Sizzle( expr, document, null, [ elem ] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val !== undefined ?
		val :
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	// Clear input after sorting to release objects
	// See https://github.com/jquery/sizzle/pull/225
	sortInput = null;

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		while ( (node = elem[i++]) ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (jQuery #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[3] || match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[6] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] ) {
				match[2] = match[4] || match[5] || "";

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, uniqueCache, outerCache, node, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType,
						diff = false;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) {

										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {

							// Seek `elem` from a previously-cached index

							// ...in a gzip-friendly way
							node = parent;
							outerCache = node[ expando ] || (node[ expando ] = {});

							// Support: IE <9 only
							// Defend against cloned attroperties (jQuery gh-1709)
							uniqueCache = outerCache[ node.uniqueID ] ||
								(outerCache[ node.uniqueID ] = {});

							cache = uniqueCache[ type ] || [];
							nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
							diff = nodeIndex && cache[ 2 ];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									uniqueCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						} else {
							// Use previously-cached element index if available
							if ( useCache ) {
								// ...in a gzip-friendly way
								node = elem;
								outerCache = node[ expando ] || (node[ expando ] = {});

								// Support: IE <9 only
								// Defend against cloned attroperties (jQuery gh-1709)
								uniqueCache = outerCache[ node.uniqueID ] ||
									(outerCache[ node.uniqueID ] = {});

								cache = uniqueCache[ type ] || [];
								nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
								diff = nodeIndex;
							}

							// xml :nth-child(...)
							// or :nth-last-child(...) or :nth(-last)?-of-type(...)
							if ( diff === false ) {
								// Use the same loop as above to seek `elem` from the start
								while ( (node = ++nodeIndex && node && node[ dir ] ||
									(diff = nodeIndex = 0) || start.pop()) ) {

									if ( ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) &&
										++diff ) {

										// Cache the index of each encountered element
										if ( useCache ) {
											outerCache = node[ expando ] || (node[ expando ] = {});

											// Support: IE <9 only
											// Defend against cloned attroperties (jQuery gh-1709)
											uniqueCache = outerCache[ node.uniqueID ] ||
												(outerCache[ node.uniqueID ] = {});

											uniqueCache[ type ] = [ dirruns, diff ];
										}

										if ( node === elem ) {
											break;
										}
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					// Don't keep the element (issue #299)
					input[0] = null;
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			text = text.replace( runescape, funescape );
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
			//   but not by others (comment: 8; processing instruction: 7; etc.)
			// nodeType < 6 works because attributes (2) do not appear as children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeType < 6 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&

				// Support: IE<8
				// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text" );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( (tokens = []) );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
};

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var oldCache, uniqueCache, outerCache,
				newCache = [ dirruns, doneName ];

			// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});

						// Support: IE <9 only
						// Defend against cloned attroperties (jQuery gh-1709)
						uniqueCache = outerCache[ elem.uniqueID ] || (outerCache[ elem.uniqueID ] = {});

						if ( (oldCache = uniqueCache[ dir ]) &&
							oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

							// Assign to newCache so results back-propagate to previous elements
							return (newCache[ 2 ] = oldCache[ 2 ]);
						} else {
							// Reuse newcache so results back-propagate to previous elements
							uniqueCache[ dir ] = newCache;

							// A match means we're done; a fail means we have to keep checking
							if ( (newCache[ 2 ] = matcher( elem, context, xml )) ) {
								return true;
							}
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
			// Avoid hanging onto element (issue #299)
			checkContext = null;
			return ret;
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	var bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, outermost ) {
			var elem, j, matcher,
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				setMatched = [],
				contextBackup = outermostContext,
				// We must always have either seed elements or outermost context
				elems = seed || byElement && Expr.find["TAG"]( "*", outermost ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
				len = elems.length;

			if ( outermost ) {
				outermostContext = context === document || context || outermost;
			}

			// Add elements passing elementMatchers directly to results
			// Support: IE<9, Safari
			// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
			for ( ; i !== len && (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					if ( !context && elem.ownerDocument !== document ) {
						setDocument( elem );
						xml = !documentIsHTML;
					}
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context || document, xml) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// `i` is now the count of elements visited above, and adding it to `matchedCount`
			// makes the latter nonnegative.
			matchedCount += i;

			// Apply set filters to unmatched elements
			// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
			// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
			// no element matchers and no seed.
			// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
			// case, which will result in a "00" `matchedCount` that differs from `i` but is also
			// numerically zero.
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !match ) {
			match = tokenize( selector );
		}
		i = match.length;
		while ( i-- ) {
			cached = matcherFromTokens( match[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );

		// Save selector and tokenization
		cached.selector = selector;
	}
	return cached;
};

/**
 * A low-level selection function that works with Sizzle's compiled
 *  selector functions
 * @param {String|Function} selector A selector or a pre-compiled
 *  selector function built with Sizzle.compile
 * @param {Element} context
 * @param {Array} [results]
 * @param {Array} [seed] A set of elements to match against
 */
select = Sizzle.select = function( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		compiled = typeof selector === "function" && selector,
		match = !seed && tokenize( (selector = compiled.selector || selector) );

	results = results || [];

	// Try to minimize operations if there is only one selector in the list and no seed
	// (the latter of which guarantees us context)
	if ( match.length === 1 ) {

		// Reduce context if the leading compound selector is an ID
		tokens = match[0] = match[0].slice( 0 );
		if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
				support.getById && context.nodeType === 9 && documentIsHTML &&
				Expr.relative[ tokens[1].type ] ) {

			context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
			if ( !context ) {
				return results;

			// Precompiled matchers will still verify ancestry, so step up a level
			} else if ( compiled ) {
				context = context.parentNode;
			}

			selector = selector.slice( tokens.shift().value.length );
		}

		// Fetch a seed set for right-to-left matching
		i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
		while ( i-- ) {
			token = tokens[i];

			// Abort if we hit a combinator
			if ( Expr.relative[ (type = token.type) ] ) {
				break;
			}
			if ( (find = Expr.find[ type ]) ) {
				// Search, expanding context for leading sibling combinators
				if ( (seed = find(
					token.matches[0].replace( runescape, funescape ),
					rsibling.test( tokens[0].type ) && testContext( context.parentNode ) || context
				)) ) {

					// If seed is empty or no tokens remain, we can return early
					tokens.splice( i, 1 );
					selector = seed.length && toSelector( tokens );
					if ( !selector ) {
						push.apply( results, seed );
						return results;
					}

					break;
				}
			}
		}
	}

	// Compile and execute a filtering function if one is not provided
	// Provide `match` to avoid retokenization if we modified the selector above
	( compiled || compile( selector, match ) )(
		seed,
		context,
		!documentIsHTML,
		results,
		!context || rsibling.test( selector ) && testContext( context.parentNode ) || context
	);
	return results;
};

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome 14-35+
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = !!hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( div1 ) {
	// Should return 1, but returns 4 (following)
	return div1.compareDocumentPosition( document.createElement("div") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( div ) {
	div.innerHTML = "<a href='#'></a>";
	return div.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( div ) {
	div.innerHTML = "<input/>";
	div.firstChild.setAttribute( "value", "" );
	return div.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( div ) {
	return div.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return elem[ name ] === true ? name.toLowerCase() :
					(val = elem.getAttributeNode( name )) && val.specified ?
					val.value :
				null;
		}
	});
}

return Sizzle;

})( window );



jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[ ":" ] = jQuery.expr.pseudos;
jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;



var dir = function( elem, dir, until ) {
	var matched = [],
		truncate = until !== undefined;

	while ( ( elem = elem[ dir ] ) && elem.nodeType !== 9 ) {
		if ( elem.nodeType === 1 ) {
			if ( truncate && jQuery( elem ).is( until ) ) {
				break;
			}
			matched.push( elem );
		}
	}
	return matched;
};


var siblings = function( n, elem ) {
	var matched = [];

	for ( ; n; n = n.nextSibling ) {
		if ( n.nodeType === 1 && n !== elem ) {
			matched.push( n );
		}
	}

	return matched;
};


var rneedsContext = jQuery.expr.match.needsContext;

var rsingleTag = ( /^<([\w-]+)\s*\/?>(?:<\/\1>|)$/ );



var risSimple = /^.[^:#\[\.,]*$/;

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			/* jshint -W018 */
			return !!qualifier.call( elem, i, elem ) !== not;
		} );

	}

	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		} );

	}

	if ( typeof qualifier === "string" ) {
		if ( risSimple.test( qualifier ) ) {
			return jQuery.filter( qualifier, elements, not );
		}

		qualifier = jQuery.filter( qualifier, elements );
	}

	return jQuery.grep( elements, function( elem ) {
		return ( jQuery.inArray( elem, qualifier ) > -1 ) !== not;
	} );
}

jQuery.filter = function( expr, elems, not ) {
	var elem = elems[ 0 ];

	if ( not ) {
		expr = ":not(" + expr + ")";
	}

	return elems.length === 1 && elem.nodeType === 1 ?
		jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [] :
		jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
			return elem.nodeType === 1;
		} ) );
};

jQuery.fn.extend( {
	find: function( selector ) {
		var i,
			ret = [],
			self = this,
			len = self.length;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter( function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			} ) );
		}

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		// Needed because $( selector, context ) becomes $( context ).find( selector )
		ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
		ret.selector = this.selector ? this.selector + " " + selector : selector;
		return ret;
	},
	filter: function( selector ) {
		return this.pushStack( winnow( this, selector || [], false ) );
	},
	not: function( selector ) {
		return this.pushStack( winnow( this, selector || [], true ) );
	},
	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	}
} );


// Initialize a jQuery object


// A central reference to the root jQuery(document)
var rootjQuery,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

	init = jQuery.fn.init = function( selector, context, root ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// init accepts an alternate rootjQuery
		// so migrate can support jQuery.sub (gh-2101)
		root = root || rootjQuery;

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector.charAt( 0 ) === "<" &&
				selector.charAt( selector.length - 1 ) === ">" &&
				selector.length >= 3 ) {

				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && ( match[ 1 ] || !context ) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[ 1 ] ) {
					context = context instanceof jQuery ? context[ 0 ] : context;

					// scripts is true for back-compat
					// Intentionally let the error be thrown if parseHTML is not present
					jQuery.merge( this, jQuery.parseHTML(
						match[ 1 ],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[ 1 ] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {

							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[ 2 ] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {

						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[ 2 ] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[ 0 ] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || root ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this.context = this[ 0 ] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return typeof root.ready !== "undefined" ?
				root.ready( selector ) :

				// Execute immediately if ready is not present
				selector( jQuery );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	};

// Give the init function the jQuery prototype for later instantiation
init.prototype = jQuery.fn;

// Initialize central reference
rootjQuery = jQuery( document );


var rparentsprev = /^(?:parents|prev(?:Until|All))/,

	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend( {
	has: function( target ) {
		var i,
			targets = jQuery( target, this ),
			len = targets.length;

		return this.filter( function() {
			for ( i = 0; i < len; i++ ) {
				if ( jQuery.contains( this, targets[ i ] ) ) {
					return true;
				}
			}
		} );
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			matched = [],
			pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( ; i < l; i++ ) {
			for ( cur = this[ i ]; cur && cur !== context; cur = cur.parentNode ) {

				// Always skip document fragments
				if ( cur.nodeType < 11 && ( pos ?
					pos.index( cur ) > -1 :

					// Don't pass non-elements to Sizzle
					cur.nodeType === 1 &&
						jQuery.find.matchesSelector( cur, selectors ) ) ) {

					matched.push( cur );
					break;
				}
			}
		}

		return this.pushStack( matched.length > 1 ? jQuery.uniqueSort( matched ) : matched );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return jQuery.inArray( this[ 0 ], jQuery( elem ) );
		}

		// Locate the position of the desired element
		return jQuery.inArray(

			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[ 0 ] : elem, this );
	},

	add: function( selector, context ) {
		return this.pushStack(
			jQuery.uniqueSort(
				jQuery.merge( this.get(), jQuery( selector, context ) )
			)
		);
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter( selector )
		);
	}
} );

function sibling( cur, dir ) {
	do {
		cur = cur[ dir ];
	} while ( cur && cur.nodeType !== 1 );

	return cur;
}

jQuery.each( {
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return siblings( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return siblings( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		if ( this.length > 1 ) {

			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				ret = jQuery.uniqueSort( ret );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				ret = ret.reverse();
			}
		}

		return this.pushStack( ret );
	};
} );
var rnotwhite = ( /\S+/g );



// Convert String-formatted options into Object-formatted ones
function createOptions( options ) {
	var object = {};
	jQuery.each( options.match( rnotwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	} );
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		createOptions( options ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,

		// Last fire value for non-forgettable lists
		memory,

		// Flag to know if list was already fired
		fired,

		// Flag to prevent firing
		locked,

		// Actual callback list
		list = [],

		// Queue of execution data for repeatable lists
		queue = [],

		// Index of currently firing callback (modified by add/remove as needed)
		firingIndex = -1,

		// Fire callbacks
		fire = function() {

			// Enforce single-firing
			locked = options.once;

			// Execute callbacks for all pending executions,
			// respecting firingIndex overrides and runtime changes
			fired = firing = true;
			for ( ; queue.length; firingIndex = -1 ) {
				memory = queue.shift();
				while ( ++firingIndex < list.length ) {

					// Run callback and check for early termination
					if ( list[ firingIndex ].apply( memory[ 0 ], memory[ 1 ] ) === false &&
						options.stopOnFalse ) {

						// Jump to end and forget the data so .add doesn't re-fire
						firingIndex = list.length;
						memory = false;
					}
				}
			}

			// Forget the data if we're done with it
			if ( !options.memory ) {
				memory = false;
			}

			firing = false;

			// Clean up if we're done firing for good
			if ( locked ) {

				// Keep an empty list if we have data for future add calls
				if ( memory ) {
					list = [];

				// Otherwise, this object is spent
				} else {
					list = "";
				}
			}
		},

		// Actual Callbacks object
		self = {

			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {

					// If we have memory from a past run, we should fire after adding
					if ( memory && !firing ) {
						firingIndex = list.length - 1;
						queue.push( memory );
					}

					( function add( args ) {
						jQuery.each( args, function( _, arg ) {
							if ( jQuery.isFunction( arg ) ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && jQuery.type( arg ) !== "string" ) {

								// Inspect recursively
								add( arg );
							}
						} );
					} )( arguments );

					if ( memory && !firing ) {
						fire();
					}
				}
				return this;
			},

			// Remove a callback from the list
			remove: function() {
				jQuery.each( arguments, function( _, arg ) {
					var index;
					while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
						list.splice( index, 1 );

						// Handle firing indexes
						if ( index <= firingIndex ) {
							firingIndex--;
						}
					}
				} );
				return this;
			},

			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ?
					jQuery.inArray( fn, list ) > -1 :
					list.length > 0;
			},

			// Remove all callbacks from the list
			empty: function() {
				if ( list ) {
					list = [];
				}
				return this;
			},

			// Disable .fire and .add
			// Abort any current/pending executions
			// Clear all callbacks and values
			disable: function() {
				locked = queue = [];
				list = memory = "";
				return this;
			},
			disabled: function() {
				return !list;
			},

			// Disable .fire
			// Also disable .add unless we have memory (since it would have no effect)
			// Abort any pending executions
			lock: function() {
				locked = true;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			locked: function() {
				return !!locked;
			},

			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( !locked ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					queue.push( args );
					if ( !firing ) {
						fire();
					}
				}
				return this;
			},

			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},

			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};


jQuery.extend( {

	Deferred: function( func ) {
		var tuples = [

				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks( "once memory" ), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks( "once memory" ), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks( "memory" ) ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred( function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];

							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[ 1 ] ]( function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.progress( newDefer.notify )
										.done( newDefer.resolve )
										.fail( newDefer.reject );
								} else {
									newDefer[ tuple[ 0 ] + "With" ](
										this === promise ? newDefer.promise() : this,
										fn ? [ returned ] : arguments
									);
								}
							} );
						} );
						fns = null;
					} ).promise();
				},

				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[ 1 ] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add( function() {

					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ]
			deferred[ tuple[ 0 ] ] = function() {
				deferred[ tuple[ 0 ] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};
			deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
		} );

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 ||
				( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred.
			// If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
					if ( values === progressValues ) {
						deferred.notifyWith( contexts, values );

					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.progress( updateFunc( i, progressContexts, progressValues ) )
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject );
				} else {
					--remaining;
				}
			}
		}

		// if we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
} );


// The deferred used on DOM ready
var readyList;

jQuery.fn.ready = function( fn ) {

	// Add the callback
	jQuery.ready.promise().done( fn );

	return this;
};

jQuery.extend( {

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.triggerHandler ) {
			jQuery( document ).triggerHandler( "ready" );
			jQuery( document ).off( "ready" );
		}
	}
} );

/**
 * Clean-up method for dom ready events
 */
function detach() {
	if ( document.addEventListener ) {
		document.removeEventListener( "DOMContentLoaded", completed );
		window.removeEventListener( "load", completed );

	} else {
		document.detachEvent( "onreadystatechange", completed );
		window.detachEvent( "onload", completed );
	}
}

/**
 * The ready event handler and self cleanup method
 */
function completed() {

	// readyState === "complete" is good enough for us to call the dom ready in oldIE
	if ( document.addEventListener ||
		window.event.type === "load" ||
		document.readyState === "complete" ) {

		detach();
		jQuery.ready();
	}
}

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called
		// after the browser event has already occurred.
		// Support: IE6-10
		// Older IE sometimes signals "interactive" too soon
		if ( document.readyState === "complete" ||
			( document.readyState !== "loading" && !document.documentElement.doScroll ) ) {

			// Handle it asynchronously to allow scripts the opportunity to delay ready
			window.setTimeout( jQuery.ready );

		// Standards-based browsers support DOMContentLoaded
		} else if ( document.addEventListener ) {

			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", completed );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", completed );

		// If IE event model is used
		} else {

			// Ensure firing before onload, maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", completed );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", completed );

			// If IE and not a frame
			// continually check to see if the document is ready
			var top = false;

			try {
				top = window.frameElement == null && document.documentElement;
			} catch ( e ) {}

			if ( top && top.doScroll ) {
				( function doScrollCheck() {
					if ( !jQuery.isReady ) {

						try {

							// Use the trick by Diego Perini
							// http://javascript.nwbox.com/IEContentLoaded/
							top.doScroll( "left" );
						} catch ( e ) {
							return window.setTimeout( doScrollCheck, 50 );
						}

						// detach all dom ready events
						detach();

						// and execute any waiting functions
						jQuery.ready();
					}
				} )();
			}
		}
	}
	return readyList.promise( obj );
};

// Kick off the DOM ready check even if the user does not
jQuery.ready.promise();




// Support: IE<9
// Iteration over object's inherited properties before its own
var i;
for ( i in jQuery( support ) ) {
	break;
}
support.ownFirst = i === "0";

// Note: most support tests are defined in their respective modules.
// false until the test is run
support.inlineBlockNeedsLayout = false;

// Execute ASAP in case we need to set body.style.zoom
jQuery( function() {

	// Minified: var a,b,c,d
	var val, div, body, container;

	body = document.getElementsByTagName( "body" )[ 0 ];
	if ( !body || !body.style ) {

		// Return for frameset docs that don't have a body
		return;
	}

	// Setup
	div = document.createElement( "div" );
	container = document.createElement( "div" );
	container.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px";
	body.appendChild( container ).appendChild( div );

	if ( typeof div.style.zoom !== "undefined" ) {

		// Support: IE<8
		// Check if natively block-level elements act like inline-block
		// elements when setting their display to 'inline' and giving
		// them layout
		div.style.cssText = "display:inline;margin:0;border:0;padding:1px;width:1px;zoom:1";

		support.inlineBlockNeedsLayout = val = div.offsetWidth === 3;
		if ( val ) {

			// Prevent IE 6 from affecting layout for positioned elements #11048
			// Prevent IE from shrinking the body in IE 7 mode #12869
			// Support: IE<8
			body.style.zoom = 1;
		}
	}

	body.removeChild( container );
} );


( function() {
	var div = document.createElement( "div" );

	// Support: IE<9
	support.deleteExpando = true;
	try {
		delete div.test;
	} catch ( e ) {
		support.deleteExpando = false;
	}

	// Null elements to avoid leaks in IE.
	div = null;
} )();
var acceptData = function( elem ) {
	var noData = jQuery.noData[ ( elem.nodeName + " " ).toLowerCase() ],
		nodeType = +elem.nodeType || 1;

	// Do not set data on non-element DOM nodes because it will not be cleared (#8335).
	return nodeType !== 1 && nodeType !== 9 ?
		false :

		// Nodes accept data unless otherwise specified; rejection can be conditional
		!noData || noData !== true && elem.getAttribute( "classid" ) === noData;
};




var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
	rmultiDash = /([A-Z])/g;

function dataAttr( elem, key, data ) {

	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {

		var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
					data === "false" ? false :
					data === "null" ? null :

					// Only convert to a number if it doesn't change the string
					+data + "" === data ? +data :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
					data;
			} catch ( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
	var name;
	for ( name in obj ) {

		// if the public data object is empty, the private is still empty
		if ( name === "data" && jQuery.isEmptyObject( obj[ name ] ) ) {
			continue;
		}
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}

function internalData( elem, name, data, pvt /* Internal Use Only */ ) {
	if ( !acceptData( elem ) ) {
		return;
	}

	var ret, thisCache,
		internalKey = jQuery.expando,

		// We have to handle DOM nodes and JS objects differently because IE6-7
		// can't GC object references properly across the DOM-JS boundary
		isNode = elem.nodeType,

		// Only DOM nodes need the global jQuery cache; JS object data is
		// attached directly to the object so GC can occur automatically
		cache = isNode ? jQuery.cache : elem,

		// Only defining an ID for JS objects if its cache already exists allows
		// the code to shortcut on the same path as a DOM node with no cache
		id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey;

	// Avoid doing any more work than we need to when trying to get data on an
	// object that has no data at all
	if ( ( !id || !cache[ id ] || ( !pvt && !cache[ id ].data ) ) &&
		data === undefined && typeof name === "string" ) {
		return;
	}

	if ( !id ) {

		// Only DOM nodes need a new unique ID for each element since their data
		// ends up in the global cache
		if ( isNode ) {
			id = elem[ internalKey ] = deletedIds.pop() || jQuery.guid++;
		} else {
			id = internalKey;
		}
	}

	if ( !cache[ id ] ) {

		// Avoid exposing jQuery metadata on plain JS objects when the object
		// is serialized using JSON.stringify
		cache[ id ] = isNode ? {} : { toJSON: jQuery.noop };
	}

	// An object can be passed to jQuery.data instead of a key/value pair; this gets
	// shallow copied over onto the existing cache
	if ( typeof name === "object" || typeof name === "function" ) {
		if ( pvt ) {
			cache[ id ] = jQuery.extend( cache[ id ], name );
		} else {
			cache[ id ].data = jQuery.extend( cache[ id ].data, name );
		}
	}

	thisCache = cache[ id ];

	// jQuery data() is stored in a separate object inside the object's internal data
	// cache in order to avoid key collisions between internal data and user-defined
	// data.
	if ( !pvt ) {
		if ( !thisCache.data ) {
			thisCache.data = {};
		}

		thisCache = thisCache.data;
	}

	if ( data !== undefined ) {
		thisCache[ jQuery.camelCase( name ) ] = data;
	}

	// Check for both converted-to-camel and non-converted data property names
	// If a data property was specified
	if ( typeof name === "string" ) {

		// First Try to find as-is property data
		ret = thisCache[ name ];

		// Test for null|undefined property data
		if ( ret == null ) {

			// Try to find the camelCased property
			ret = thisCache[ jQuery.camelCase( name ) ];
		}
	} else {
		ret = thisCache;
	}

	return ret;
}

function internalRemoveData( elem, name, pvt ) {
	if ( !acceptData( elem ) ) {
		return;
	}

	var thisCache, i,
		isNode = elem.nodeType,

		// See jQuery.data for more information
		cache = isNode ? jQuery.cache : elem,
		id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

	// If there is already no cache entry for this object, there is no
	// purpose in continuing
	if ( !cache[ id ] ) {
		return;
	}

	if ( name ) {

		thisCache = pvt ? cache[ id ] : cache[ id ].data;

		if ( thisCache ) {

			// Support array or space separated string names for data keys
			if ( !jQuery.isArray( name ) ) {

				// try the string as a key before any manipulation
				if ( name in thisCache ) {
					name = [ name ];
				} else {

					// split the camel cased version by spaces unless a key with the spaces exists
					name = jQuery.camelCase( name );
					if ( name in thisCache ) {
						name = [ name ];
					} else {
						name = name.split( " " );
					}
				}
			} else {

				// If "name" is an array of keys...
				// When data is initially created, via ("key", "val") signature,
				// keys will be converted to camelCase.
				// Since there is no way to tell _how_ a key was added, remove
				// both plain key and camelCase key. #12786
				// This will only penalize the array argument path.
				name = name.concat( jQuery.map( name, jQuery.camelCase ) );
			}

			i = name.length;
			while ( i-- ) {
				delete thisCache[ name[ i ] ];
			}

			// If there is no data left in the cache, we want to continue
			// and let the cache object itself get destroyed
			if ( pvt ? !isEmptyDataObject( thisCache ) : !jQuery.isEmptyObject( thisCache ) ) {
				return;
			}
		}
	}

	// See jQuery.data for more information
	if ( !pvt ) {
		delete cache[ id ].data;

		// Don't destroy the parent cache unless the internal data object
		// had been the only thing left in it
		if ( !isEmptyDataObject( cache[ id ] ) ) {
			return;
		}
	}

	// Destroy the cache
	if ( isNode ) {
		jQuery.cleanData( [ elem ], true );

	// Use delete when supported for expandos or `cache` is not a window per isWindow (#10080)
	/* jshint eqeqeq: false */
	} else if ( support.deleteExpando || cache != cache.window ) {
		/* jshint eqeqeq: true */
		delete cache[ id ];

	// When all else fails, undefined
	} else {
		cache[ id ] = undefined;
	}
}

jQuery.extend( {
	cache: {},

	// The following elements (space-suffixed to avoid Object.prototype collisions)
	// throw uncatchable exceptions if you attempt to set expando properties
	noData: {
		"applet ": true,
		"embed ": true,

		// ...but Flash objects (which have this classid) *can* handle expandos
		"object ": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[ jQuery.expando ] ] : elem[ jQuery.expando ];
		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data ) {
		return internalData( elem, name, data );
	},

	removeData: function( elem, name ) {
		return internalRemoveData( elem, name );
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return internalData( elem, name, data, true );
	},

	_removeData: function( elem, name ) {
		return internalRemoveData( elem, name, true );
	}
} );

jQuery.fn.extend( {
	data: function( key, value ) {
		var i, name, data,
			elem = this[ 0 ],
			attrs = elem && elem.attributes;

		// Special expections of .data basically thwart jQuery.access,
		// so implement the relevant behavior ourselves

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = jQuery.data( elem );

				if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
					i = attrs.length;
					while ( i-- ) {

						// Support: IE11+
						// The attrs elements can be null (#14894)
						if ( attrs[ i ] ) {
							name = attrs[ i ].name;
							if ( name.indexOf( "data-" ) === 0 ) {
								name = jQuery.camelCase( name.slice( 5 ) );
								dataAttr( elem, name, data[ name ] );
							}
						}
					}
					jQuery._data( elem, "parsedAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each( function() {
				jQuery.data( this, key );
			} );
		}

		return arguments.length > 1 ?

			// Sets one value
			this.each( function() {
				jQuery.data( this, key, value );
			} ) :

			// Gets one value
			// Try to fetch any internally stored data first
			elem ? dataAttr( elem, key, jQuery.data( elem, key ) ) : undefined;
	},

	removeData: function( key ) {
		return this.each( function() {
			jQuery.removeData( this, key );
		} );
	}
} );


jQuery.extend( {
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = jQuery._data( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray( data ) ) {
					queue = jQuery._data( elem, type, jQuery.makeArray( data ) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// not intended for public consumption - generates a queueHooks object,
	// or returns the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return jQuery._data( elem, key ) || jQuery._data( elem, key, {
			empty: jQuery.Callbacks( "once memory" ).add( function() {
				jQuery._removeData( elem, type + "queue" );
				jQuery._removeData( elem, key );
			} )
		} );
	}
} );

jQuery.fn.extend( {
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[ 0 ], type );
		}

		return data === undefined ?
			this :
			this.each( function() {
				var queue = jQuery.queue( this, type, data );

				// ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[ 0 ] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			} );
	},
	dequeue: function( type ) {
		return this.each( function() {
			jQuery.dequeue( this, type );
		} );
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},

	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while ( i-- ) {
			tmp = jQuery._data( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
} );


( function() {
	var shrinkWrapBlocksVal;

	support.shrinkWrapBlocks = function() {
		if ( shrinkWrapBlocksVal != null ) {
			return shrinkWrapBlocksVal;
		}

		// Will be changed later if needed.
		shrinkWrapBlocksVal = false;

		// Minified: var b,c,d
		var div, body, container;

		body = document.getElementsByTagName( "body" )[ 0 ];
		if ( !body || !body.style ) {

			// Test fired too early or in an unsupported environment, exit.
			return;
		}

		// Setup
		div = document.createElement( "div" );
		container = document.createElement( "div" );
		container.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px";
		body.appendChild( container ).appendChild( div );

		// Support: IE6
		// Check if elements with layout shrink-wrap their children
		if ( typeof div.style.zoom !== "undefined" ) {

			// Reset CSS: box-sizing; display; margin; border
			div.style.cssText =

				// Support: Firefox<29, Android 2.3
				// Vendor-prefix box-sizing
				"-webkit-box-sizing:content-box;-moz-box-sizing:content-box;" +
				"box-sizing:content-box;display:block;margin:0;border:0;" +
				"padding:1px;width:1px;zoom:1";
			div.appendChild( document.createElement( "div" ) ).style.width = "5px";
			shrinkWrapBlocksVal = div.offsetWidth !== 3;
		}

		body.removeChild( container );

		return shrinkWrapBlocksVal;
	};

} )();
var pnum = ( /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/ ).source;

var rcssNum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );


var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

var isHidden = function( elem, el ) {

		// isHidden might be called from jQuery#filter function;
		// in that case, element will be second argument
		elem = el || elem;
		return jQuery.css( elem, "display" ) === "none" ||
			!jQuery.contains( elem.ownerDocument, elem );
	};



function adjustCSS( elem, prop, valueParts, tween ) {
	var adjusted,
		scale = 1,
		maxIterations = 20,
		currentValue = tween ?
			function() { return tween.cur(); } :
			function() { return jQuery.css( elem, prop, "" ); },
		initial = currentValue(),
		unit = valueParts && valueParts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

		// Starting value computation is required for potential unit mismatches
		initialInUnit = ( jQuery.cssNumber[ prop ] || unit !== "px" && +initial ) &&
			rcssNum.exec( jQuery.css( elem, prop ) );

	if ( initialInUnit && initialInUnit[ 3 ] !== unit ) {

		// Trust units reported by jQuery.css
		unit = unit || initialInUnit[ 3 ];

		// Make sure we update the tween properties later on
		valueParts = valueParts || [];

		// Iteratively approximate from a nonzero starting point
		initialInUnit = +initial || 1;

		do {

			// If previous iteration zeroed out, double until we get *something*.
			// Use string for doubling so we don't accidentally see scale as unchanged below
			scale = scale || ".5";

			// Adjust and apply
			initialInUnit = initialInUnit / scale;
			jQuery.style( elem, prop, initialInUnit + unit );

		// Update scale, tolerating zero or NaN from tween.cur()
		// Break the loop if scale is unchanged or perfect, or if we've just had enough.
		} while (
			scale !== ( scale = currentValue() / initial ) && scale !== 1 && --maxIterations
		);
	}

	if ( valueParts ) {
		initialInUnit = +initialInUnit || +initial || 0;

		// Apply relative offset (+=/-=) if specified
		adjusted = valueParts[ 1 ] ?
			initialInUnit + ( valueParts[ 1 ] + 1 ) * valueParts[ 2 ] :
			+valueParts[ 2 ];
		if ( tween ) {
			tween.unit = unit;
			tween.start = initialInUnit;
			tween.end = adjusted;
		}
	}
	return adjusted;
}


// Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function
var access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
	var i = 0,
		length = elems.length,
		bulk = key == null;

	// Sets many values
	if ( jQuery.type( key ) === "object" ) {
		chainable = true;
		for ( i in key ) {
			access( elems, fn, i, key[ i ], true, emptyGet, raw );
		}

	// Sets one value
	} else if ( value !== undefined ) {
		chainable = true;

		if ( !jQuery.isFunction( value ) ) {
			raw = true;
		}

		if ( bulk ) {

			// Bulk operations run against the entire set
			if ( raw ) {
				fn.call( elems, value );
				fn = null;

			// ...except when executing function values
			} else {
				bulk = fn;
				fn = function( elem, key, value ) {
					return bulk.call( jQuery( elem ), value );
				};
			}
		}

		if ( fn ) {
			for ( ; i < length; i++ ) {
				fn(
					elems[ i ],
					key,
					raw ? value : value.call( elems[ i ], i, fn( elems[ i ], key ) )
				);
			}
		}
	}

	return chainable ?
		elems :

		// Gets
		bulk ?
			fn.call( elems ) :
			length ? fn( elems[ 0 ], key ) : emptyGet;
};
var rcheckableType = ( /^(?:checkbox|radio)$/i );

var rtagName = ( /<([\w:-]+)/ );

var rscriptType = ( /^$|\/(?:java|ecma)script/i );

var rleadingWhitespace = ( /^\s+/ );

var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|" +
		"details|dialog|figcaption|figure|footer|header|hgroup|main|" +
		"mark|meter|nav|output|picture|progress|section|summary|template|time|video";



function createSafeFragment( document ) {
	var list = nodeNames.split( "|" ),
		safeFrag = document.createDocumentFragment();

	if ( safeFrag.createElement ) {
		while ( list.length ) {
			safeFrag.createElement(
				list.pop()
			);
		}
	}
	return safeFrag;
}


( function() {
	var div = document.createElement( "div" ),
		fragment = document.createDocumentFragment(),
		input = document.createElement( "input" );

	// Setup
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

	// IE strips leading whitespace when .innerHTML is used
	support.leadingWhitespace = div.firstChild.nodeType === 3;

	// Make sure that tbody elements aren't automatically inserted
	// IE will insert them into empty tables
	support.tbody = !div.getElementsByTagName( "tbody" ).length;

	// Make sure that link elements get serialized correctly by innerHTML
	// This requires a wrapper element in IE
	support.htmlSerialize = !!div.getElementsByTagName( "link" ).length;

	// Makes sure cloning an html5 element does not cause problems
	// Where outerHTML is undefined, this still works
	support.html5Clone =
		document.createElement( "nav" ).cloneNode( true ).outerHTML !== "<:nav></:nav>";

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	input.type = "checkbox";
	input.checked = true;
	fragment.appendChild( input );
	support.appendChecked = input.checked;

	// Make sure textarea (and checkbox) defaultValue is properly cloned
	// Support: IE6-IE11+
	div.innerHTML = "<textarea>x</textarea>";
	support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;

	// #11217 - WebKit loses check when the name is after the checked attribute
	fragment.appendChild( div );

	// Support: Windows Web Apps (WWA)
	// `name` and `type` must use .setAttribute for WWA (#14901)
	input = document.createElement( "input" );
	input.setAttribute( "type", "radio" );
	input.setAttribute( "checked", "checked" );
	input.setAttribute( "name", "t" );

	div.appendChild( input );

	// Support: Safari 5.1, iOS 5.1, Android 4.x, Android 2.3
	// old WebKit doesn't clone checked state correctly in fragments
	support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE<9
	// Cloned elements keep attachEvent handlers, we use addEventListener on IE9+
	support.noCloneEvent = !!div.addEventListener;

	// Support: IE<9
	// Since attributes and properties are the same in IE,
	// cleanData must set properties to undefined rather than use removeAttribute
	div[ jQuery.expando ] = 1;
	support.attributes = !div.getAttribute( jQuery.expando );
} )();


// We have to close these tags to support XHTML (#13200)
var wrapMap = {
	option: [ 1, "<select multiple='multiple'>", "</select>" ],
	legend: [ 1, "<fieldset>", "</fieldset>" ],
	area: [ 1, "<map>", "</map>" ],

	// Support: IE8
	param: [ 1, "<object>", "</object>" ],
	thead: [ 1, "<table>", "</table>" ],
	tr: [ 2, "<table><tbody>", "</tbody></table>" ],
	col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
	td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

	// IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,
	// unless wrapped in a div with non-breaking characters in front of it.
	_default: support.htmlSerialize ? [ 0, "", "" ] : [ 1, "X<div>", "</div>" ]
};

// Support: IE8-IE9
wrapMap.optgroup = wrapMap.option;

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;


function getAll( context, tag ) {
	var elems, elem,
		i = 0,
		found = typeof context.getElementsByTagName !== "undefined" ?
			context.getElementsByTagName( tag || "*" ) :
			typeof context.querySelectorAll !== "undefined" ?
				context.querySelectorAll( tag || "*" ) :
				undefined;

	if ( !found ) {
		for ( found = [], elems = context.childNodes || context;
			( elem = elems[ i ] ) != null;
			i++
		) {
			if ( !tag || jQuery.nodeName( elem, tag ) ) {
				found.push( elem );
			} else {
				jQuery.merge( found, getAll( elem, tag ) );
			}
		}
	}

	return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
		jQuery.merge( [ context ], found ) :
		found;
}


// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var elem,
		i = 0;
	for ( ; ( elem = elems[ i ] ) != null; i++ ) {
		jQuery._data(
			elem,
			"globalEval",
			!refElements || jQuery._data( refElements[ i ], "globalEval" )
		);
	}
}


var rhtml = /<|&#?\w+;/,
	rtbody = /<tbody/i;

function fixDefaultChecked( elem ) {
	if ( rcheckableType.test( elem.type ) ) {
		elem.defaultChecked = elem.checked;
	}
}

function buildFragment( elems, context, scripts, selection, ignored ) {
	var j, elem, contains,
		tmp, tag, tbody, wrap,
		l = elems.length,

		// Ensure a safe fragment
		safe = createSafeFragment( context ),

		nodes = [],
		i = 0;

	for ( ; i < l; i++ ) {
		elem = elems[ i ];

		if ( elem || elem === 0 ) {

			// Add nodes directly
			if ( jQuery.type( elem ) === "object" ) {
				jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

			// Convert non-html into a text node
			} else if ( !rhtml.test( elem ) ) {
				nodes.push( context.createTextNode( elem ) );

			// Convert html into DOM nodes
			} else {
				tmp = tmp || safe.appendChild( context.createElement( "div" ) );

				// Deserialize a standard representation
				tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
				wrap = wrapMap[ tag ] || wrapMap._default;

				tmp.innerHTML = wrap[ 1 ] + jQuery.htmlPrefilter( elem ) + wrap[ 2 ];

				// Descend through wrappers to the right content
				j = wrap[ 0 ];
				while ( j-- ) {
					tmp = tmp.lastChild;
				}

				// Manually add leading whitespace removed by IE
				if ( !support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
					nodes.push( context.createTextNode( rleadingWhitespace.exec( elem )[ 0 ] ) );
				}

				// Remove IE's autoinserted <tbody> from table fragments
				if ( !support.tbody ) {

					// String was a <table>, *may* have spurious <tbody>
					elem = tag === "table" && !rtbody.test( elem ) ?
						tmp.firstChild :

						// String was a bare <thead> or <tfoot>
						wrap[ 1 ] === "<table>" && !rtbody.test( elem ) ?
							tmp :
							0;

					j = elem && elem.childNodes.length;
					while ( j-- ) {
						if ( jQuery.nodeName( ( tbody = elem.childNodes[ j ] ), "tbody" ) &&
							!tbody.childNodes.length ) {

							elem.removeChild( tbody );
						}
					}
				}

				jQuery.merge( nodes, tmp.childNodes );

				// Fix #12392 for WebKit and IE > 9
				tmp.textContent = "";

				// Fix #12392 for oldIE
				while ( tmp.firstChild ) {
					tmp.removeChild( tmp.firstChild );
				}

				// Remember the top-level container for proper cleanup
				tmp = safe.lastChild;
			}
		}
	}

	// Fix #11356: Clear elements from fragment
	if ( tmp ) {
		safe.removeChild( tmp );
	}

	// Reset defaultChecked for any radios and checkboxes
	// about to be appended to the DOM in IE 6/7 (#8060)
	if ( !support.appendChecked ) {
		jQuery.grep( getAll( nodes, "input" ), fixDefaultChecked );
	}

	i = 0;
	while ( ( elem = nodes[ i++ ] ) ) {

		// Skip elements already in the context collection (trac-4087)
		if ( selection && jQuery.inArray( elem, selection ) > -1 ) {
			if ( ignored ) {
				ignored.push( elem );
			}

			continue;
		}

		contains = jQuery.contains( elem.ownerDocument, elem );

		// Append to fragment
		tmp = getAll( safe.appendChild( elem ), "script" );

		// Preserve script evaluation history
		if ( contains ) {
			setGlobalEval( tmp );
		}

		// Capture executables
		if ( scripts ) {
			j = 0;
			while ( ( elem = tmp[ j++ ] ) ) {
				if ( rscriptType.test( elem.type || "" ) ) {
					scripts.push( elem );
				}
			}
		}
	}

	tmp = null;

	return safe;
}


( function() {
	var i, eventName,
		div = document.createElement( "div" );

	// Support: IE<9 (lack submit/change bubble), Firefox (lack focus(in | out) events)
	for ( i in { submit: true, change: true, focusin: true } ) {
		eventName = "on" + i;

		if ( !( support[ i ] = eventName in window ) ) {

			// Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP)
			div.setAttribute( eventName, "t" );
			support[ i ] = div.attributes[ eventName ].expando === false;
		}
	}

	// Null elements to avoid leaks in IE.
	div = null;
} )();


var rformElems = /^(?:input|select|textarea)$/i,
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

// Support: IE9
// See #13393 for more info
function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

function on( elem, types, selector, data, fn, one ) {
	var origFn, type;

	// Types can be a map of types/handlers
	if ( typeof types === "object" ) {

		// ( types-Object, selector, data )
		if ( typeof selector !== "string" ) {

			// ( types-Object, data )
			data = data || selector;
			selector = undefined;
		}
		for ( type in types ) {
			on( elem, type, selector, data, types[ type ], one );
		}
		return elem;
	}

	if ( data == null && fn == null ) {

		// ( types, fn )
		fn = selector;
		data = selector = undefined;
	} else if ( fn == null ) {
		if ( typeof selector === "string" ) {

			// ( types, selector, fn )
			fn = data;
			data = undefined;
		} else {

			// ( types, data, fn )
			fn = data;
			data = selector;
			selector = undefined;
		}
	}
	if ( fn === false ) {
		fn = returnFalse;
	} else if ( !fn ) {
		return elem;
	}

	if ( one === 1 ) {
		origFn = fn;
		fn = function( event ) {

			// Can use an empty set, since event contains the info
			jQuery().off( event );
			return origFn.apply( this, arguments );
		};

		// Use same guid so caller can remove using origFn
		fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
	}
	return elem.each( function() {
		jQuery.event.add( this, types, fn, data, selector );
	} );
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {
		var tmp, events, t, handleObjIn,
			special, eventHandle, handleObj,
			handlers, type, namespaces, origType,
			elemData = jQuery._data( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !( events = elemData.events ) ) {
			events = elemData.events = {};
		}
		if ( !( eventHandle = elemData.handle ) ) {
			eventHandle = elemData.handle = function( e ) {

				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" &&
					( !e || jQuery.event.triggered !== e.type ) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};

			// Add elem as a property of the handle fn to prevent a memory leak
			// with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( rnotwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend( {
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join( "." )
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !( handlers = events[ type ] ) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener/attachEvent if the special events handler returns false
				if ( !special.setup ||
					special.setup.call( elem, data, namespaces, eventHandle ) === false ) {

					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {
		var j, handleObj, tmp,
			origCount, t, events,
			special, handlers, type,
			namespaces, origType,
			elemData = jQuery.hasData( elem ) && jQuery._data( elem );

		if ( !elemData || !( events = elemData.events ) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( rnotwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[ 2 ] &&
				new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector ||
						selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown ||
					special.teardown.call( elem, namespaces, elemData.handle ) === false ) {

					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			delete elemData.handle;

			// removeData also checks for emptiness and clears the expando if empty
			// so use it instead of delete
			jQuery._removeData( elem, "events" );
		}
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		var handle, ontype, cur,
			bubbleType, special, tmp, i,
			eventPath = [ elem || document ],
			type = hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split( "." ) : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf( "." ) > -1 ) {

			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split( "." );
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf( ":" ) < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join( "." );
		event.rnamespace = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === ( elem.ownerDocument || document ) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( ( cur = eventPath[ i++ ] ) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] &&
				jQuery._data( cur, "handle" );

			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && handle.apply && acceptData( cur ) ) {
				event.result = handle.apply( cur, data );
				if ( event.result === false ) {
					event.preventDefault();
				}
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if (
				( !special._default ||
				 special._default.apply( eventPath.pop(), data ) === false
				) && acceptData( elem )
			) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction() check here because IE6/7 fails that test.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && elem[ type ] && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					try {
						elem[ type ]();
					} catch ( e ) {

						// IE<9 dies on focus/blur to hidden element (#1486,#12518)
						// only reproducible on winXP IE8 native, not IE9 in IE8 mode
					}
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event );

		var i, j, ret, matched, handleObj,
			handlerQueue = [],
			args = slice.call( arguments ),
			handlers = ( jQuery._data( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[ 0 ] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( ( matched = handlerQueue[ i++ ] ) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( ( handleObj = matched.handlers[ j++ ] ) &&
				!event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or 2) have namespace(s)
				// a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.rnamespace || event.rnamespace.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( ( jQuery.event.special[ handleObj.origType ] || {} ).handle ||
						handleObj.handler ).apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( ( event.result = ret ) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var i, matches, sel, handleObj,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Support (at least): Chrome, IE9
		// Find delegate handlers
		// Black-hole SVG <use> instance trees (#13180)
		//
		// Support: Firefox<=42+
		// Avoid non-left-click in FF but don't block IE radio events (#3861, gh-2343)
		if ( delegateCount && cur.nodeType &&
			( event.type !== "click" || isNaN( event.button ) || event.button < 1 ) ) {

			/* jshint eqeqeq: false */
			for ( ; cur != this; cur = cur.parentNode || this ) {
				/* jshint eqeqeq: true */

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && ( cur.disabled !== true || event.type !== "click" ) ) {
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matches[ sel ] === undefined ) {
							matches[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) > -1 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matches[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push( { elem: cur, handlers: matches } );
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( delegateCount < handlers.length ) {
			handlerQueue.push( { elem: this, handlers: handlers.slice( delegateCount ) } );
		}

		return handlerQueue;
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop, copy,
			type = event.type,
			originalEvent = event,
			fixHook = this.fixHooks[ type ];

		if ( !fixHook ) {
			this.fixHooks[ type ] = fixHook =
				rmouseEvent.test( type ) ? this.mouseHooks :
				rkeyEvent.test( type ) ? this.keyHooks :
				{};
		}
		copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = new jQuery.Event( originalEvent );

		i = copy.length;
		while ( i-- ) {
			prop = copy[ i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Support: IE<9
		// Fix target property (#1925)
		if ( !event.target ) {
			event.target = originalEvent.srcElement || document;
		}

		// Support: Safari 6-8+
		// Target should not be a text node (#504, #13143)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// Support: IE<9
		// For mouse/key events, metaKey==false if it's undefined (#3368, #11328)
		event.metaKey = !!event.metaKey;

		return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	props: ( "altKey bubbles cancelable ctrlKey currentTarget detail eventPhase " +
		"metaKey relatedTarget shiftKey target timeStamp view which" ).split( " " ),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split( " " ),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: ( "button buttons clientX clientY fromElement offsetX offsetY " +
			"pageX pageY screenX screenY toElement" ).split( " " ),
		filter: function( event, original ) {
			var body, eventDoc, doc,
				button = original.button,
				fromElement = original.fromElement;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX +
					( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) -
					( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY +
					( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) -
					( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add relatedTarget, if necessary
			if ( !event.relatedTarget && fromElement ) {
				event.relatedTarget = fromElement === event.target ?
					original.toElement :
					fromElement;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	special: {
		load: {

			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {

			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					try {
						this.focus();
						return false;
					} catch ( e ) {

						// Support: IE<9
						// If we error on focus to hidden element (#1486, #12518),
						// let .trigger() run the handlers
					}
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {

			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( jQuery.nodeName( this, "input" ) && this.type === "checkbox" && this.click ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return jQuery.nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Support: Firefox 20+
				// Firefox doesn't alert if the returnValue field is not set.
				if ( event.result !== undefined && event.originalEvent ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	},

	// Piggyback on a donor event to simulate a different one
	simulate: function( type, elem, event ) {
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true

				// Previously, `originalEvent: {}` was set here, so stopPropagation call
				// would not be triggered on donor event, since in our own
				// jQuery.event.stopPropagation function we had a check for existence of
				// originalEvent.stopPropagation method, so, consequently it would be a noop.
				//
				// Guard for simulated events was moved to jQuery.event.stopPropagation function
				// since `originalEvent` should point to the original event for the
				// constancy with other events and for more focused logic
			}
		);

		jQuery.event.trigger( e, null, elem );

		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {

		// This "if" is needed for plain objects
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle );
		}
	} :
	function( elem, type, handle ) {
		var name = "on" + type;

		if ( elem.detachEvent ) {

			// #8545, #7054, preventing memory leaks for custom events in IE6-8
			// detachEvent needed property on element, by name of that event,
			// to properly expose it to GC
			if ( typeof elem[ name ] === "undefined" ) {
				elem[ name ] = null;
			}

			elem.detachEvent( name, handle );
		}
	};

jQuery.Event = function( src, props ) {

	// Allow instantiation without the 'new' keyword
	if ( !( this instanceof jQuery.Event ) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = src.defaultPrevented ||
				src.defaultPrevented === undefined &&

				// Support: IE < 9, Android < 4.0
				src.returnValue === false ?
			returnTrue :
			returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	constructor: jQuery.Event,
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;
		if ( !e ) {
			return;
		}

		// If preventDefault exists, run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// Support: IE
		// Otherwise set the returnValue property of the original event to false
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;

		if ( !e || this.isSimulated ) {
			return;
		}

		// If stopPropagation exists, run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}

		// Support: IE
		// Set the cancelBubble property of the original event to true
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		var e = this.originalEvent;

		this.isImmediatePropagationStopped = returnTrue;

		if ( e && e.stopImmediatePropagation ) {
			e.stopImmediatePropagation();
		}

		this.stopPropagation();
	}
};

// Create mouseenter/leave events using mouseover/out and event-time checks
// so that event delegation works in jQuery.
// Do the same for pointerenter/pointerleave and pointerover/pointerout
//
// Support: Safari 7 only
// Safari sends mouseenter too often; see:
// https://code.google.com/p/chromium/issues/detail?id=470258
// for the description of the bug (it existed in older Chrome versions as well).
jQuery.each( {
	mouseenter: "mouseover",
	mouseleave: "mouseout",
	pointerenter: "pointerover",
	pointerleave: "pointerout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mouseenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || ( related !== target && !jQuery.contains( target, related ) ) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
} );

// IE submit delegation
if ( !support.submit ) {

	jQuery.event.special.submit = {
		setup: function() {

			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Lazy-add a submit handler when a descendant form may potentially be submitted
			jQuery.event.add( this, "click._submit keypress._submit", function( e ) {

				// Node name check avoids a VML-related crash in IE (#9807)
				var elem = e.target,
					form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ?

						// Support: IE <=8
						// We use jQuery.prop instead of elem.form
						// to allow fixing the IE8 delegated submit issue (gh-2332)
						// by 3rd party polyfills/workarounds.
						jQuery.prop( elem, "form" ) :
						undefined;

				if ( form && !jQuery._data( form, "submit" ) ) {
					jQuery.event.add( form, "submit._submit", function( event ) {
						event._submitBubble = true;
					} );
					jQuery._data( form, "submit", true );
				}
			} );

			// return undefined since we don't need an event listener
		},

		postDispatch: function( event ) {

			// If form was submitted by the user, bubble the event up the tree
			if ( event._submitBubble ) {
				delete event._submitBubble;
				if ( this.parentNode && !event.isTrigger ) {
					jQuery.event.simulate( "submit", this.parentNode, event );
				}
			}
		},

		teardown: function() {

			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
			jQuery.event.remove( this, "._submit" );
		}
	};
}

// IE change delegation and checkbox/radio fix
if ( !support.change ) {

	jQuery.event.special.change = {

		setup: function() {

			if ( rformElems.test( this.nodeName ) ) {

				// IE doesn't fire change on a check/radio until blur; trigger it on click
				// after a propertychange. Eat the blur-change in special.change.handle.
				// This still fires onchange a second time for check/radio after blur.
				if ( this.type === "checkbox" || this.type === "radio" ) {
					jQuery.event.add( this, "propertychange._change", function( event ) {
						if ( event.originalEvent.propertyName === "checked" ) {
							this._justChanged = true;
						}
					} );
					jQuery.event.add( this, "click._change", function( event ) {
						if ( this._justChanged && !event.isTrigger ) {
							this._justChanged = false;
						}

						// Allow triggered, simulated change events (#11500)
						jQuery.event.simulate( "change", this, event );
					} );
				}
				return false;
			}

			// Delegated event; lazy-add a change handler on descendant inputs
			jQuery.event.add( this, "beforeactivate._change", function( e ) {
				var elem = e.target;

				if ( rformElems.test( elem.nodeName ) && !jQuery._data( elem, "change" ) ) {
					jQuery.event.add( elem, "change._change", function( event ) {
						if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
							jQuery.event.simulate( "change", this.parentNode, event );
						}
					} );
					jQuery._data( elem, "change", true );
				}
			} );
		},

		handle: function( event ) {
			var elem = event.target;

			// Swallow native change events from checkbox/radio, we already triggered them above
			if ( this !== elem || event.isSimulated || event.isTrigger ||
				( elem.type !== "radio" && elem.type !== "checkbox" ) ) {

				return event.handleObj.handler.apply( this, arguments );
			}
		},

		teardown: function() {
			jQuery.event.remove( this, "._change" );

			return !rformElems.test( this.nodeName );
		}
	};
}

// Support: Firefox
// Firefox doesn't have focus(in | out) events
// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
//
// Support: Chrome, Safari
// focus(in | out) events fire after focus & blur events,
// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
// Related ticket - https://code.google.com/p/chromium/issues/detail?id=449857
if ( !support.focusin ) {
	jQuery.each( { focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler on the document while someone wants focusin/focusout
		var handler = function( event ) {
			jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ) );
		};

		jQuery.event.special[ fix ] = {
			setup: function() {
				var doc = this.ownerDocument || this,
					attaches = jQuery._data( doc, fix );

				if ( !attaches ) {
					doc.addEventListener( orig, handler, true );
				}
				jQuery._data( doc, fix, ( attaches || 0 ) + 1 );
			},
			teardown: function() {
				var doc = this.ownerDocument || this,
					attaches = jQuery._data( doc, fix ) - 1;

				if ( !attaches ) {
					doc.removeEventListener( orig, handler, true );
					jQuery._removeData( doc, fix );
				} else {
					jQuery._data( doc, fix, attaches );
				}
			}
		};
	} );
}

jQuery.fn.extend( {

	on: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn );
	},
	one: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {

			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ?
					handleObj.origType + "." + handleObj.namespace :
					handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {

			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {

			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each( function() {
			jQuery.event.remove( this, types, fn, selector );
		} );
	},

	trigger: function( type, data ) {
		return this.each( function() {
			jQuery.event.trigger( type, data, this );
		} );
	},
	triggerHandler: function( type, data ) {
		var elem = this[ 0 ];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
} );


var rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g,
	rnoshimcache = new RegExp( "<(?:" + nodeNames + ")[\\s/>]", "i" ),
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:-]+)[^>]*)\/>/gi,

	// Support: IE 10-11, Edge 10240+
	// In IE/Edge using regex groups here causes severe slowdowns.
	// See https://connect.microsoft.com/IE/feedback/details/1736512/
	rnoInnerhtml = /<script|<style|<link/i,

	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,
	safeFragment = createSafeFragment( document ),
	fragmentDiv = safeFragment.appendChild( document.createElement( "div" ) );

// Support: IE<8
// Manipulating tables requires a tbody
function manipulationTarget( elem, content ) {
	return jQuery.nodeName( elem, "table" ) &&
		jQuery.nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ?

		elem.getElementsByTagName( "tbody" )[ 0 ] ||
			elem.appendChild( elem.ownerDocument.createElement( "tbody" ) ) :
		elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = ( jQuery.find.attr( elem, "type" ) !== null ) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );
	if ( match ) {
		elem.type = match[ 1 ];
	} else {
		elem.removeAttribute( "type" );
	}
	return elem;
}

function cloneCopyEvent( src, dest ) {
	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var type, i, l,
		oldData = jQuery._data( src ),
		curData = jQuery._data( dest, oldData ),
		events = oldData.events;

	if ( events ) {
		delete curData.handle;
		curData.events = {};

		for ( type in events ) {
			for ( i = 0, l = events[ type ].length; i < l; i++ ) {
				jQuery.event.add( dest, type, events[ type ][ i ] );
			}
		}
	}

	// make the cloned public data object a copy from the original
	if ( curData.data ) {
		curData.data = jQuery.extend( {}, curData.data );
	}
}

function fixCloneNodeIssues( src, dest ) {
	var nodeName, e, data;

	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	nodeName = dest.nodeName.toLowerCase();

	// IE6-8 copies events bound via attachEvent when using cloneNode.
	if ( !support.noCloneEvent && dest[ jQuery.expando ] ) {
		data = jQuery._data( dest );

		for ( e in data.events ) {
			jQuery.removeEvent( dest, e, data.handle );
		}

		// Event data gets referenced instead of copied if the expando gets copied too
		dest.removeAttribute( jQuery.expando );
	}

	// IE blanks contents when cloning scripts, and tries to evaluate newly-set text
	if ( nodeName === "script" && dest.text !== src.text ) {
		disableScript( dest ).text = src.text;
		restoreScript( dest );

	// IE6-10 improperly clones children of object elements using classid.
	// IE10 throws NoModificationAllowedError if parent is null, #12132.
	} else if ( nodeName === "object" ) {
		if ( dest.parentNode ) {
			dest.outerHTML = src.outerHTML;
		}

		// This path appears unavoidable for IE9. When cloning an object
		// element in IE9, the outerHTML strategy above is not sufficient.
		// If the src has innerHTML and the destination does not,
		// copy the src.innerHTML into the dest.innerHTML. #10324
		if ( support.html5Clone && ( src.innerHTML && !jQuery.trim( dest.innerHTML ) ) ) {
			dest.innerHTML = src.innerHTML;
		}

	} else if ( nodeName === "input" && rcheckableType.test( src.type ) ) {

		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set

		dest.defaultChecked = dest.checked = src.checked;

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.defaultSelected = dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

function domManip( collection, args, callback, ignored ) {

	// Flatten any nested arrays
	args = concat.apply( [], args );

	var first, node, hasScripts,
		scripts, doc, fragment,
		i = 0,
		l = collection.length,
		iNoClone = l - 1,
		value = args[ 0 ],
		isFunction = jQuery.isFunction( value );

	// We can't cloneNode fragments that contain checked, in WebKit
	if ( isFunction ||
			( l > 1 && typeof value === "string" &&
				!support.checkClone && rchecked.test( value ) ) ) {
		return collection.each( function( index ) {
			var self = collection.eq( index );
			if ( isFunction ) {
				args[ 0 ] = value.call( this, index, self.html() );
			}
			domManip( self, args, callback, ignored );
		} );
	}

	if ( l ) {
		fragment = buildFragment( args, collection[ 0 ].ownerDocument, false, collection, ignored );
		first = fragment.firstChild;

		if ( fragment.childNodes.length === 1 ) {
			fragment = first;
		}

		// Require either new content or an interest in ignored elements to invoke the callback
		if ( first || ignored ) {
			scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
			hasScripts = scripts.length;

			// Use the original fragment for the last item
			// instead of the first because it can end up
			// being emptied incorrectly in certain situations (#8070).
			for ( ; i < l; i++ ) {
				node = fragment;

				if ( i !== iNoClone ) {
					node = jQuery.clone( node, true, true );

					// Keep references to cloned scripts for later restoration
					if ( hasScripts ) {

						// Support: Android<4.1, PhantomJS<2
						// push.apply(_, arraylike) throws on ancient WebKit
						jQuery.merge( scripts, getAll( node, "script" ) );
					}
				}

				callback.call( collection[ i ], node, i );
			}

			if ( hasScripts ) {
				doc = scripts[ scripts.length - 1 ].ownerDocument;

				// Reenable scripts
				jQuery.map( scripts, restoreScript );

				// Evaluate executable scripts on first document insertion
				for ( i = 0; i < hasScripts; i++ ) {
					node = scripts[ i ];
					if ( rscriptType.test( node.type || "" ) &&
						!jQuery._data( node, "globalEval" ) &&
						jQuery.contains( doc, node ) ) {

						if ( node.src ) {

							// Optional AJAX dependency, but won't run scripts if not present
							if ( jQuery._evalUrl ) {
								jQuery._evalUrl( node.src );
							}
						} else {
							jQuery.globalEval(
								( node.text || node.textContent || node.innerHTML || "" )
									.replace( rcleanScript, "" )
							);
						}
					}
				}
			}

			// Fix #11809: Avoid leaking memory
			fragment = first = null;
		}
	}

	return collection;
}

function remove( elem, selector, keepData ) {
	var node,
		elems = selector ? jQuery.filter( selector, elem ) : elem,
		i = 0;

	for ( ; ( node = elems[ i ] ) != null; i++ ) {

		if ( !keepData && node.nodeType === 1 ) {
			jQuery.cleanData( getAll( node ) );
		}

		if ( node.parentNode ) {
			if ( keepData && jQuery.contains( node.ownerDocument, node ) ) {
				setGlobalEval( getAll( node, "script" ) );
			}
			node.parentNode.removeChild( node );
		}
	}

	return elem;
}

jQuery.extend( {
	htmlPrefilter: function( html ) {
		return html.replace( rxhtmlTag, "<$1></$2>" );
	},

	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var destElements, node, clone, i, srcElements,
			inPage = jQuery.contains( elem.ownerDocument, elem );

		if ( support.html5Clone || jQuery.isXMLDoc( elem ) ||
			!rnoshimcache.test( "<" + elem.nodeName + ">" ) ) {

			clone = elem.cloneNode( true );

		// IE<=8 does not properly clone detached, unknown element nodes
		} else {
			fragmentDiv.innerHTML = elem.outerHTML;
			fragmentDiv.removeChild( clone = fragmentDiv.firstChild );
		}

		if ( ( !support.noCloneEvent || !support.noCloneChecked ) &&
				( elem.nodeType === 1 || elem.nodeType === 11 ) && !jQuery.isXMLDoc( elem ) ) {

			// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			// Fix all IE cloning issues
			for ( i = 0; ( node = srcElements[ i ] ) != null; ++i ) {

				// Ensure that the destination node is not null; Fixes #9587
				if ( destElements[ i ] ) {
					fixCloneNodeIssues( node, destElements[ i ] );
				}
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0; ( node = srcElements[ i ] ) != null; i++ ) {
					cloneCopyEvent( node, destElements[ i ] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		destElements = srcElements = node = null;

		// Return the cloned set
		return clone;
	},

	cleanData: function( elems, /* internal */ forceAcceptData ) {
		var elem, type, id, data,
			i = 0,
			internalKey = jQuery.expando,
			cache = jQuery.cache,
			attributes = support.attributes,
			special = jQuery.event.special;

		for ( ; ( elem = elems[ i ] ) != null; i++ ) {
			if ( forceAcceptData || acceptData( elem ) ) {

				id = elem[ internalKey ];
				data = id && cache[ id ];

				if ( data ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Remove cache only if it was not already removed by jQuery.event.remove
					if ( cache[ id ] ) {

						delete cache[ id ];

						// Support: IE<9
						// IE does not allow us to delete expando properties from nodes
						// IE creates expando attributes along with the property
						// IE does not have a removeAttribute function on Document nodes
						if ( !attributes && typeof elem.removeAttribute !== "undefined" ) {
							elem.removeAttribute( internalKey );

						// Webkit & Blink performance suffers when deleting properties
						// from DOM nodes, so set to undefined instead
						// https://code.google.com/p/chromium/issues/detail?id=378607
						} else {
							elem[ internalKey ] = undefined;
						}

						deletedIds.push( id );
					}
				}
			}
		}
	}
} );

jQuery.fn.extend( {

	// Keep domManip exposed until 3.0 (gh-2225)
	domManip: domManip,

	detach: function( selector ) {
		return remove( this, selector, true );
	},

	remove: function( selector ) {
		return remove( this, selector );
	},

	text: function( value ) {
		return access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().append(
					( this[ 0 ] && this[ 0 ].ownerDocument || document ).createTextNode( value )
				);
		}, null, value, arguments.length );
	},

	append: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		} );
	},

	prepend: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		} );
	},

	before: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		} );
	},

	after: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		} );
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; ( elem = this[ i ] ) != null; i++ ) {

			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem, false ) );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}

			// If this is a select, ensure that it displays empty (#12336)
			// Support: IE<9
			if ( elem.options && jQuery.nodeName( elem, "select" ) ) {
				elem.options.length = 0;
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function() {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		} );
	},

	html: function( value ) {
		return access( this, function( value ) {
			var elem = this[ 0 ] || {},
				i = 0,
				l = this.length;

			if ( value === undefined ) {
				return elem.nodeType === 1 ?
					elem.innerHTML.replace( rinlinejQuery, "" ) :
					undefined;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				( support.htmlSerialize || !rnoshimcache.test( value )  ) &&
				( support.leadingWhitespace || !rleadingWhitespace.test( value ) ) &&
				!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

				value = jQuery.htmlPrefilter( value );

				try {
					for ( ; i < l; i++ ) {

						// Remove element nodes and prevent memory leaks
						elem = this[ i ] || {};
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch ( e ) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var ignored = [];

		// Make the changes, replacing each non-ignored context element with the new content
		return domManip( this, arguments, function( elem ) {
			var parent = this.parentNode;

			if ( jQuery.inArray( this, ignored ) < 0 ) {
				jQuery.cleanData( getAll( this ) );
				if ( parent ) {
					parent.replaceChild( elem, this );
				}
			}

		// Force callback invocation
		}, ignored );
	}
} );

jQuery.each( {
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			i = 0,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone( true );
			jQuery( insert[ i ] )[ original ]( elems );

			// Modern browsers can apply jQuery collections as arrays, but oldIE needs a .get()
			push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
} );


var iframe,
	elemdisplay = {

		// Support: Firefox
		// We have to pre-define these values for FF (#10227)
		HTML: "block",
		BODY: "block"
	};

/**
 * Retrieve the actual display of a element
 * @param {String} name nodeName of the element
 * @param {Object} doc Document object
 */

// Called only from within defaultDisplay
function actualDisplay( name, doc ) {
	var elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),

		display = jQuery.css( elem[ 0 ], "display" );

	// We don't have any data stored on the element,
	// so use "detach" method as fast way to get rid of the element
	elem.detach();

	return display;
}

/**
 * Try to determine the default display value of an element
 * @param {String} nodeName
 */
function defaultDisplay( nodeName ) {
	var doc = document,
		display = elemdisplay[ nodeName ];

	if ( !display ) {
		display = actualDisplay( nodeName, doc );

		// If the simple way fails, read from inside an iframe
		if ( display === "none" || !display ) {

			// Use the already-created iframe if possible
			iframe = ( iframe || jQuery( "<iframe frameborder='0' width='0' height='0'/>" ) )
				.appendTo( doc.documentElement );

			// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
			doc = ( iframe[ 0 ].contentWindow || iframe[ 0 ].contentDocument ).document;

			// Support: IE
			doc.write();
			doc.close();

			display = actualDisplay( nodeName, doc );
			iframe.detach();
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return display;
}
var rmargin = ( /^margin/ );

var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );

var swap = function( elem, options, callback, args ) {
	var ret, name,
		old = {};

	// Remember the old values, and insert the new ones
	for ( name in options ) {
		old[ name ] = elem.style[ name ];
		elem.style[ name ] = options[ name ];
	}

	ret = callback.apply( elem, args || [] );

	// Revert the old values
	for ( name in options ) {
		elem.style[ name ] = old[ name ];
	}

	return ret;
};


var documentElement = document.documentElement;



( function() {
	var pixelPositionVal, pixelMarginRightVal, boxSizingReliableVal,
		reliableHiddenOffsetsVal, reliableMarginRightVal, reliableMarginLeftVal,
		container = document.createElement( "div" ),
		div = document.createElement( "div" );

	// Finish early in limited (non-browser) environments
	if ( !div.style ) {
		return;
	}

	div.style.cssText = "float:left;opacity:.5";

	// Support: IE<9
	// Make sure that element opacity exists (as opposed to filter)
	support.opacity = div.style.opacity === "0.5";

	// Verify style float existence
	// (IE uses styleFloat instead of cssFloat)
	support.cssFloat = !!div.style.cssFloat;

	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	container = document.createElement( "div" );
	container.style.cssText = "border:0;width:8px;height:0;top:0;left:-9999px;" +
		"padding:0;margin-top:1px;position:absolute";
	div.innerHTML = "";
	container.appendChild( div );

	// Support: Firefox<29, Android 2.3
	// Vendor-prefix box-sizing
	support.boxSizing = div.style.boxSizing === "" || div.style.MozBoxSizing === "" ||
		div.style.WebkitBoxSizing === "";

	jQuery.extend( support, {
		reliableHiddenOffsets: function() {
			if ( pixelPositionVal == null ) {
				computeStyleTests();
			}
			return reliableHiddenOffsetsVal;
		},

		boxSizingReliable: function() {

			// We're checking for pixelPositionVal here instead of boxSizingReliableVal
			// since that compresses better and they're computed together anyway.
			if ( pixelPositionVal == null ) {
				computeStyleTests();
			}
			return boxSizingReliableVal;
		},

		pixelMarginRight: function() {

			// Support: Android 4.0-4.3
			if ( pixelPositionVal == null ) {
				computeStyleTests();
			}
			return pixelMarginRightVal;
		},

		pixelPosition: function() {
			if ( pixelPositionVal == null ) {
				computeStyleTests();
			}
			return pixelPositionVal;
		},

		reliableMarginRight: function() {

			// Support: Android 2.3
			if ( pixelPositionVal == null ) {
				computeStyleTests();
			}
			return reliableMarginRightVal;
		},

		reliableMarginLeft: function() {

			// Support: IE <=8 only, Android 4.0 - 4.3 only, Firefox <=3 - 37
			if ( pixelPositionVal == null ) {
				computeStyleTests();
			}
			return reliableMarginLeftVal;
		}
	} );

	function computeStyleTests() {
		var contents, divStyle,
			documentElement = document.documentElement;

		// Setup
		documentElement.appendChild( container );

		div.style.cssText =

			// Support: Android 2.3
			// Vendor-prefix box-sizing
			"-webkit-box-sizing:border-box;box-sizing:border-box;" +
			"position:relative;display:block;" +
			"margin:auto;border:1px;padding:1px;" +
			"top:1%;width:50%";

		// Support: IE<9
		// Assume reasonable values in the absence of getComputedStyle
		pixelPositionVal = boxSizingReliableVal = reliableMarginLeftVal = false;
		pixelMarginRightVal = reliableMarginRightVal = true;

		// Check for getComputedStyle so that this code is not run in IE<9.
		if ( window.getComputedStyle ) {
			divStyle = window.getComputedStyle( div );
			pixelPositionVal = ( divStyle || {} ).top !== "1%";
			reliableMarginLeftVal = ( divStyle || {} ).marginLeft === "2px";
			boxSizingReliableVal = ( divStyle || { width: "4px" } ).width === "4px";

			// Support: Android 4.0 - 4.3 only
			// Some styles come back with percentage values, even though they shouldn't
			div.style.marginRight = "50%";
			pixelMarginRightVal = ( divStyle || { marginRight: "4px" } ).marginRight === "4px";

			// Support: Android 2.3 only
			// Div with explicit width and no margin-right incorrectly
			// gets computed margin-right based on width of container (#3333)
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			contents = div.appendChild( document.createElement( "div" ) );

			// Reset CSS: box-sizing; display; margin; border; padding
			contents.style.cssText = div.style.cssText =

				// Support: Android 2.3
				// Vendor-prefix box-sizing
				"-webkit-box-sizing:content-box;-moz-box-sizing:content-box;" +
				"box-sizing:content-box;display:block;margin:0;border:0;padding:0";
			contents.style.marginRight = contents.style.width = "0";
			div.style.width = "1px";

			reliableMarginRightVal =
				!parseFloat( ( window.getComputedStyle( contents ) || {} ).marginRight );

			div.removeChild( contents );
		}

		// Support: IE6-8
		// First check that getClientRects works as expected
		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		div.style.display = "none";
		reliableHiddenOffsetsVal = div.getClientRects().length === 0;
		if ( reliableHiddenOffsetsVal ) {
			div.style.display = "";
			div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
			div.childNodes[ 0 ].style.borderCollapse = "separate";
			contents = div.getElementsByTagName( "td" );
			contents[ 0 ].style.cssText = "margin:0;border:0;padding:0;display:none";
			reliableHiddenOffsetsVal = contents[ 0 ].offsetHeight === 0;
			if ( reliableHiddenOffsetsVal ) {
				contents[ 0 ].style.display = "";
				contents[ 1 ].style.display = "none";
				reliableHiddenOffsetsVal = contents[ 0 ].offsetHeight === 0;
			}
		}

		// Teardown
		documentElement.removeChild( container );
	}

} )();


var getStyles, curCSS,
	rposition = /^(top|right|bottom|left)$/;

if ( window.getComputedStyle ) {
	getStyles = function( elem ) {

		// Support: IE<=11+, Firefox<=30+ (#15098, #14150)
		// IE throws on elements created in popups
		// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
		var view = elem.ownerDocument.defaultView;

		if ( !view || !view.opener ) {
			view = window;
		}

		return view.getComputedStyle( elem );
	};

	curCSS = function( elem, name, computed ) {
		var width, minWidth, maxWidth, ret,
			style = elem.style;

		computed = computed || getStyles( elem );

		// getPropertyValue is only needed for .css('filter') in IE9, see #12537
		ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined;

		// Support: Opera 12.1x only
		// Fall back to style even without computed
		// computed is undefined for elems on document fragments
		if ( ( ret === "" || ret === undefined ) && !jQuery.contains( elem.ownerDocument, elem ) ) {
			ret = jQuery.style( elem, name );
		}

		if ( computed ) {

			// A tribute to the "awesome hack by Dean Edwards"
			// Chrome < 17 and Safari 5.0 uses "computed value"
			// instead of "used value" for margin-right
			// Safari 5.1.7 (at least) returns percentage for a larger set of values,
			// but width seems to be reliably pixels
			// this is against the CSSOM draft spec:
			// http://dev.w3.org/csswg/cssom/#resolved-values
			if ( !support.pixelMarginRight() && rnumnonpx.test( ret ) && rmargin.test( name ) ) {

				// Remember the original values
				width = style.width;
				minWidth = style.minWidth;
				maxWidth = style.maxWidth;

				// Put in the new values to get a computed value out
				style.minWidth = style.maxWidth = style.width = ret;
				ret = computed.width;

				// Revert the changed values
				style.width = width;
				style.minWidth = minWidth;
				style.maxWidth = maxWidth;
			}
		}

		// Support: IE
		// IE returns zIndex value as an integer.
		return ret === undefined ?
			ret :
			ret + "";
	};
} else if ( documentElement.currentStyle ) {
	getStyles = function( elem ) {
		return elem.currentStyle;
	};

	curCSS = function( elem, name, computed ) {
		var left, rs, rsLeft, ret,
			style = elem.style;

		computed = computed || getStyles( elem );
		ret = computed ? computed[ name ] : undefined;

		// Avoid setting ret to empty string here
		// so we don't default to auto
		if ( ret == null && style && style[ name ] ) {
			ret = style[ name ];
		}

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		// but not position css attributes, as those are
		// proportional to the parent element instead
		// and we can't measure the parent instead because it
		// might trigger a "stacking dolls" problem
		if ( rnumnonpx.test( ret ) && !rposition.test( name ) ) {

			// Remember the original values
			left = style.left;
			rs = elem.runtimeStyle;
			rsLeft = rs && rs.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				rs.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : ret;
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				rs.left = rsLeft;
			}
		}

		// Support: IE
		// IE returns zIndex value as an integer.
		return ret === undefined ?
			ret :
			ret + "" || "auto";
	};
}




function addGetHookIf( conditionFn, hookFn ) {

	// Define the hook, we'll check on the first run if it's really needed.
	return {
		get: function() {
			if ( conditionFn() ) {

				// Hook not needed (or it's not possible to use it due
				// to missing dependency), remove it.
				delete this.get;
				return;
			}

			// Hook needed; redefine it so that the support test is not executed again.
			return ( this.get = hookFn ).apply( this, arguments );
		}
	};
}


var

		ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity\s*=\s*([^)]*)/i,

	// swappable if display is none or starts with table except
	// "table", "table-cell", or "table-caption"
	// see here for display values:
	// https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rnumsplit = new RegExp( "^(" + pnum + ")(.*)$", "i" ),

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: "0",
		fontWeight: "400"
	},

	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ],
	emptyStyle = document.createElement( "div" ).style;


// return a css property mapped to a potentially vendor prefixed property
function vendorPropName( name ) {

	// shortcut for names that are not vendor prefixed
	if ( name in emptyStyle ) {
		return name;
	}

	// check for vendor prefixed names
	var capName = name.charAt( 0 ).toUpperCase() + name.slice( 1 ),
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in emptyStyle ) {
			return name;
		}
	}
}

function showHide( elements, show ) {
	var display, elem, hidden,
		values = [],
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		values[ index ] = jQuery._data( elem, "olddisplay" );
		display = elem.style.display;
		if ( show ) {

			// Reset the inline display of this element to learn if it is
			// being hidden by cascaded rules or not
			if ( !values[ index ] && display === "none" ) {
				elem.style.display = "";
			}

			// Set elements which have been overridden with display: none
			// in a stylesheet to whatever the default browser style is
			// for such an element
			if ( elem.style.display === "" && isHidden( elem ) ) {
				values[ index ] =
					jQuery._data( elem, "olddisplay", defaultDisplay( elem.nodeName ) );
			}
		} else {
			hidden = isHidden( elem );

			if ( display && display !== "none" || !hidden ) {
				jQuery._data(
					elem,
					"olddisplay",
					hidden ? display : jQuery.css( elem, "display" )
				);
			}
		}
	}

	// Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
			elem.style.display = show ? values[ index ] || "" : "none";
		}
	}

	return elements;
}

function setPositiveNumber( elem, value, subtract ) {
	var matches = rnumsplit.exec( value );
	return matches ?

		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?

		// If we already have the right measurement, avoid augmentation
		4 :

		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;

	for ( ; i < 4; i += 2 ) {

		// both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {

			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// at this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {

			// at this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// at this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var valueIsBorderBox = true,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		styles = getStyles( elem ),
		isBorderBox = support.boxSizing &&
			jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {

		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name, styles );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test( val ) ) {
			return val;
		}

		// we need the check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox &&
			( support.boxSizingReliable() || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

jQuery.extend( {

	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {

					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"animationIterationCount": true,
		"columnCount": true,
		"fillOpacity": true,
		"flexGrow": true,
		"flexShrink": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {

		// normalize float css property
		"float": support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {

		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] ||
			( jQuery.cssProps[ origName ] = vendorPropName( origName ) || origName );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// Convert "+=" or "-=" to relative numbers (#7345)
			if ( type === "string" && ( ret = rcssNum.exec( value ) ) && ret[ 1 ] ) {
				value = adjustCSS( elem, name, ret );

				// Fixes bug #9237
				type = "number";
			}

			// Make sure that null and NaN values aren't set. See: #7116
			if ( value == null || value !== value ) {
				return;
			}

			// If a number was passed in, add the unit (except for certain CSS properties)
			if ( type === "number" ) {
				value += ret && ret[ 3 ] || ( jQuery.cssNumber[ origName ] ? "" : "px" );
			}

			// Fixes #8908, it can be done more correctly by specifing setters in cssHooks,
			// but it would mean to define eight
			// (for every problematic property) identical functions
			if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !( "set" in hooks ) ||
				( value = hooks.set( elem, value, extra ) ) !== undefined ) {

				// Support: IE
				// Swallow errors from 'invalid' CSS values (#5509)
				try {
					style[ name ] = value;
				} catch ( e ) {}
			}

		} else {

			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks &&
				( ret = hooks.get( elem, false, extra ) ) !== undefined ) {

				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var num, val, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] ||
			( jQuery.cssProps[ origName ] = vendorPropName( origName ) || origName );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		//convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Return, converting to number if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || isFinite( num ) ? num || 0 : val;
		}
		return val;
	}
} );

jQuery.each( [ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {

				// certain elements can have dimension info if we invisibly show them
				// however, it must have a current display style that would benefit from this
				return rdisplayswap.test( jQuery.css( elem, "display" ) ) &&
					elem.offsetWidth === 0 ?
						swap( elem, cssShow, function() {
							return getWidthOrHeight( elem, name, extra );
						} ) :
						getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var styles = extra && getStyles( elem );
			return setPositiveNumber( elem, value, extra ?
				augmentWidthOrHeight(
					elem,
					name,
					extra,
					support.boxSizing &&
						jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				) : 0
			);
		}
	};
} );

if ( !support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {

			// IE uses filters for opacity
			return ropacity.test( ( computed && elem.currentStyle ?
				elem.currentStyle.filter :
				elem.style.filter ) || "" ) ?
					( 0.01 * parseFloat( RegExp.$1 ) ) + "" :
					computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style,
				currentStyle = elem.currentStyle,
				opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
				filter = currentStyle && currentStyle.filter || style.filter || "";

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// if setting opacity to 1, and no other filters exist -
			// attempt to remove filter attribute #6652
			// if value === "", then remove inline opacity #12685
			if ( ( value >= 1 || value === "" ) &&
					jQuery.trim( filter.replace( ralpha, "" ) ) === "" &&
					style.removeAttribute ) {

				// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
				// if "filter:" is present at all, clearType is disabled, we want to avoid this
				// style.removeAttribute is IE Only, but so apparently is this code path...
				style.removeAttribute( "filter" );

				// if there is no filter style applied in a css rule
				// or unset inline opacity, we are done
				if ( value === "" || currentStyle && !currentStyle.filter ) {
					return;
				}
			}

			// otherwise, set new filter values
			style.filter = ralpha.test( filter ) ?
				filter.replace( ralpha, opacity ) :
				filter + " " + opacity;
		}
	};
}

jQuery.cssHooks.marginRight = addGetHookIf( support.reliableMarginRight,
	function( elem, computed ) {
		if ( computed ) {
			return swap( elem, { "display": "inline-block" },
				curCSS, [ elem, "marginRight" ] );
		}
	}
);

jQuery.cssHooks.marginLeft = addGetHookIf( support.reliableMarginLeft,
	function( elem, computed ) {
		if ( computed ) {
			return (
				parseFloat( curCSS( elem, "marginLeft" ) ) ||

				// Support: IE<=11+
				// Running getBoundingClientRect on a disconnected node in IE throws an error
				// Support: IE8 only
				// getClientRects() errors on disconnected elems
				( jQuery.contains( elem.ownerDocument, elem ) ?
					elem.getBoundingClientRect().left -
						swap( elem, { marginLeft: 0 }, function() {
							return elem.getBoundingClientRect().left;
						} ) :
					0
				)
			) + "px";
		}
	}
);

// These hooks are used by animate to expand properties
jQuery.each( {
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// assumes a single number if not a string
				parts = typeof value === "string" ? value.split( " " ) : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
} );

jQuery.fn.extend( {
	css: function( name, value ) {
		return access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			if ( jQuery.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	},
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each( function() {
			if ( isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		} );
	}
} );


function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || jQuery.easing._default;
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			// Use a property on the element directly when it is not a DOM element,
			// or when there is no matching style property that exists.
			if ( tween.elem.nodeType !== 1 ||
				tween.elem[ tween.prop ] != null && tween.elem.style[ tween.prop ] == null ) {
				return tween.elem[ tween.prop ];
			}

			// passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails
			// so, simple values such as "10px" are parsed to Float.
			// complex values such as "rotate(1rad)" are returned as is.
			result = jQuery.css( tween.elem, tween.prop, "" );

			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {

			// use step hook for back compat - use cssHook if its there - use .style if its
			// available and use plain properties where available
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.nodeType === 1 &&
				( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null ||
					jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE <=9
// Panic based approach to setting things on disconnected nodes

Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p * Math.PI ) / 2;
	},
	_default: "swing"
};

jQuery.fx = Tween.prototype.init;

// Back Compat <1.8 extension point
jQuery.fx.step = {};




var
	fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rrun = /queueHooks$/;

// Animations created synchronously will run synchronously
function createFxNow() {
	window.setTimeout( function() {
		fxNow = undefined;
	} );
	return ( fxNow = jQuery.now() );
}

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		attrs = { height: type },
		i = 0;

	// if we include width, step value is 1 to do all cssExpand values,
	// if we don't include width, step value is 2 to skip over Left and Right
	includeWidth = includeWidth ? 1 : 0;
	for ( ; i < 4 ; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( Animation.tweeners[ prop ] || [] ).concat( Animation.tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( ( tween = collection[ index ].call( animation, prop, value ) ) ) {

			// we're done with this property
			return tween;
		}
	}
}

function defaultPrefilter( elem, props, opts ) {
	/* jshint validthis: true */
	var prop, value, toggle, tween, hooks, oldfire, display, checkDisplay,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHidden( elem ),
		dataShow = jQuery._data( elem, "fxshow" );

	// handle queue: false promises
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always( function() {

			// doing this makes sure that the complete handler will be called
			// before this completes
			anim.always( function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			} );
		} );
	}

	// height/width overflow pass
	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {

		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE does not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		display = jQuery.css( elem, "display" );

		// Test default display if display is currently "none"
		checkDisplay = display === "none" ?
			jQuery._data( elem, "olddisplay" ) || defaultDisplay( elem.nodeName ) : display;

		if ( checkDisplay === "inline" && jQuery.css( elem, "float" ) === "none" ) {

			// inline-level elements accept inline-block;
			// block-level elements need to be inline with layout
			if ( !support.inlineBlockNeedsLayout || defaultDisplay( elem.nodeName ) === "inline" ) {
				style.display = "inline-block";
			} else {
				style.zoom = 1;
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		if ( !support.shrinkWrapBlocks() ) {
			anim.always( function() {
				style.overflow = opts.overflow[ 0 ];
				style.overflowX = opts.overflow[ 1 ];
				style.overflowY = opts.overflow[ 2 ];
			} );
		}
	}

	// show/hide pass
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {

				// If there is dataShow left over from a stopped hide or show
				// and we are going to proceed with show, we should pretend to be hidden
				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
					hidden = true;
				} else {
					continue;
				}
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );

		// Any non-fx value stops us from restoring the original display value
		} else {
			display = undefined;
		}
	}

	if ( !jQuery.isEmptyObject( orig ) ) {
		if ( dataShow ) {
			if ( "hidden" in dataShow ) {
				hidden = dataShow.hidden;
			}
		} else {
			dataShow = jQuery._data( elem, "fxshow", {} );
		}

		// store state if its toggle - enables .stop().toggle() to "reverse"
		if ( toggle ) {
			dataShow.hidden = !hidden;
		}
		if ( hidden ) {
			jQuery( elem ).show();
		} else {
			anim.done( function() {
				jQuery( elem ).hide();
			} );
		}
		anim.done( function() {
			var prop;
			jQuery._removeData( elem, "fxshow" );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		} );
		for ( prop in orig ) {
			tween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );

			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = tween.start;
				if ( hidden ) {
					tween.end = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				}
			}
		}

	// If this is a noop like .hide().hide(), restore an overwritten display value
	} else if ( ( display === "none" ? defaultDisplay( elem.nodeName ) : display ) === "inline" ) {
		style.display = display;
	}
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// not quite $.extend, this wont overwrite keys already present.
			// also - reusing 'index' from above because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = Animation.prefilters.length,
		deferred = jQuery.Deferred().always( function() {

			// don't match elem in the :animated selector
			delete tick.elem;
		} ),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),

				// Support: Android 2.3
				// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ] );

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise( {
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, {
				specialEasing: {},
				easing: jQuery.easing._default
			}, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,

					// if we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// resolve when we played the last frame
				// otherwise, reject
				if ( gotoEnd ) {
					deferred.notifyWith( elem, [ animation, 1, 0 ] );
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		} ),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = Animation.prefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			if ( jQuery.isFunction( result.stop ) ) {
				jQuery._queueHooks( animation.elem, animation.opts.queue ).stop =
					jQuery.proxy( result.stop, result );
			}
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		} )
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}

jQuery.Animation = jQuery.extend( Animation, {

	tweeners: {
		"*": [ function( prop, value ) {
			var tween = this.createTween( prop, value );
			adjustCSS( tween.elem, prop, rcssNum.exec( value ), tween );
			return tween;
		} ]
	},

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.match( rnotwhite );
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			Animation.tweeners[ prop ] = Animation.tweeners[ prop ] || [];
			Animation.tweeners[ prop ].unshift( callback );
		}
	},

	prefilters: [ defaultPrefilter ],

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			Animation.prefilters.unshift( callback );
		} else {
			Animation.prefilters.push( callback );
		}
	}
} );

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
		opt.duration in jQuery.fx.speeds ?
			jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

	// normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.fn.extend( {
	fadeTo: function( speed, to, easing, callback ) {

		// show any hidden elements after setting opacity to 0
		return this.filter( isHidden ).css( "opacity", 0 ).show()

			// animate to the value specified
			.end().animate( { opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {

				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || jQuery._data( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each( function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = jQuery._data( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this &&
					( type == null || timers[ index ].queue === type ) ) {

					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		} );
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each( function() {
			var index,
				data = jQuery._data( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// enable finishing flag on private data
			data.finish = true;

			// empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// turn off finishing flag
			delete data.finish;
		} );
	}
} );

jQuery.each( [ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
} );

// Generate shortcuts for custom animations
jQuery.each( {
	slideDown: genFx( "show" ),
	slideUp: genFx( "hide" ),
	slideToggle: genFx( "toggle" ),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
} );

jQuery.timers = [];
jQuery.fx.tick = function() {
	var timer,
		timers = jQuery.timers,
		i = 0;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];

		// Checks the timer has not already been removed
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	jQuery.timers.push( timer );
	if ( timer() ) {
		jQuery.fx.start();
	} else {
		jQuery.timers.pop();
	}
};

jQuery.fx.interval = 13;

jQuery.fx.start = function() {
	if ( !timerId ) {
		timerId = window.setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.stop = function() {
	window.clearInterval( timerId );
	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,

	// Default speed
	_default: 400
};


// Based off of the plugin by Clint Helfers, with permission.
// http://web.archive.org/web/20100324014747/http://blindsignals.com/index.php/2009/07/jquery-delay/
jQuery.fn.delay = function( time, type ) {
	time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
	type = type || "fx";

	return this.queue( type, function( next, hooks ) {
		var timeout = window.setTimeout( next, time );
		hooks.stop = function() {
			window.clearTimeout( timeout );
		};
	} );
};


( function() {
	var a,
		input = document.createElement( "input" ),
		div = document.createElement( "div" ),
		select = document.createElement( "select" ),
		opt = select.appendChild( document.createElement( "option" ) );

	// Setup
	div = document.createElement( "div" );
	div.setAttribute( "className", "t" );
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";
	a = div.getElementsByTagName( "a" )[ 0 ];

	// Support: Windows Web Apps (WWA)
	// `type` must use .setAttribute for WWA (#14901)
	input.setAttribute( "type", "checkbox" );
	div.appendChild( input );

	a = div.getElementsByTagName( "a" )[ 0 ];

	// First batch of tests.
	a.style.cssText = "top:1px";

	// Test setAttribute on camelCase class.
	// If it works, we need attrFixes when doing get/setAttribute (ie6/7)
	support.getSetAttribute = div.className !== "t";

	// Get the style information from getAttribute
	// (IE uses .cssText instead)
	support.style = /top/.test( a.getAttribute( "style" ) );

	// Make sure that URLs aren't manipulated
	// (IE normalizes it by default)
	support.hrefNormalized = a.getAttribute( "href" ) === "/a";

	// Check the default checkbox/radio value ("" on WebKit; "on" elsewhere)
	support.checkOn = !!input.value;

	// Make sure that a selected-by-default option has a working selected property.
	// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
	support.optSelected = opt.selected;

	// Tests for enctype support on a form (#6743)
	support.enctype = !!document.createElement( "form" ).enctype;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Support: IE8 only
	// Check if we can trust getAttribute("value")
	input = document.createElement( "input" );
	input.setAttribute( "value", "" );
	support.input = input.getAttribute( "value" ) === "";

	// Check if an input maintains its value after becoming a radio
	input.value = "t";
	input.setAttribute( "type", "radio" );
	support.radioValue = input.value === "t";
} )();


var rreturn = /\r/g,
	rspaces = /[\x20\t\r\n\f]+/g;

jQuery.fn.extend( {
	val: function( value ) {
		var hooks, ret, isFunction,
			elem = this[ 0 ];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] ||
					jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if (
					hooks &&
					"get" in hooks &&
					( ret = hooks.get( elem, "value" ) ) !== undefined
				) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?

					// handle most common string cases
					ret.replace( rreturn, "" ) :

					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each( function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map( val, function( value ) {
					return value == null ? "" : value + "";
				} );
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !( "set" in hooks ) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		} );
	}
} );

jQuery.extend( {
	valHooks: {
		option: {
			get: function( elem ) {
				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :

					// Support: IE10-11+
					// option.text throws exceptions (#14686, #14858)
					// Strip and collapse whitespace
					// https://html.spec.whatwg.org/#strip-and-collapse-whitespace
					jQuery.trim( jQuery.text( elem ) ).replace( rspaces, " " );
			}
		},
		select: {
			get: function( elem ) {
				var value, option,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one" || index < 0,
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max :
						one ? index : 0;

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// oldIE doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&

							// Don't return options that are disabled or in a disabled optgroup
							( support.optDisabled ?
								!option.disabled :
								option.getAttribute( "disabled" ) === null ) &&
							( !option.parentNode.disabled ||
								!jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];

					if ( jQuery.inArray( jQuery.valHooks.option.get( option ), values ) > -1 ) {

						// Support: IE6
						// When new option element is added to select box we need to
						// force reflow of newly added node in order to workaround delay
						// of initialization properties
						try {
							option.selected = optionSet = true;

						} catch ( _ ) {

							// Will be executed only in IE6
							option.scrollHeight;
						}

					} else {
						option.selected = false;
					}
				}

				// Force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}

				return options;
			}
		}
	}
} );

// Radios and checkboxes getter/setter
jQuery.each( [ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery( elem ).val(), value ) > -1 );
			}
		}
	};
	if ( !support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			return elem.getAttribute( "value" ) === null ? "on" : elem.value;
		};
	}
} );




var nodeHook, boolHook,
	attrHandle = jQuery.expr.attrHandle,
	ruseDefault = /^(?:checked|selected)$/i,
	getSetAttribute = support.getSetAttribute,
	getSetInput = support.input;

jQuery.fn.extend( {
	attr: function( name, value ) {
		return access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each( function() {
			jQuery.removeAttr( this, name );
		} );
	}
} );

jQuery.extend( {
	attr: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set attributes on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {
			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return;
			}

			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			elem.setAttribute( name, value + "" );
			return value;
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		ret = jQuery.find.attr( elem, name );

		// Non-existent attributes return null, we normalize to undefined
		return ret == null ? undefined : ret;
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !support.radioValue && value === "radio" &&
					jQuery.nodeName( elem, "input" ) ) {

					// Setting the type on a radio button after the value resets the value in IE8-9
					// Reset value to default in case type is set after value during creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	removeAttr: function( elem, value ) {
		var name, propName,
			i = 0,
			attrNames = value && value.match( rnotwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( ( name = attrNames[ i++ ] ) ) {
				propName = jQuery.propFix[ name ] || name;

				// Boolean attributes get special treatment (#10870)
				if ( jQuery.expr.match.bool.test( name ) ) {

					// Set corresponding property to false
					if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
						elem[ propName ] = false;

					// Support: IE<9
					// Also clear defaultChecked/defaultSelected (if appropriate)
					} else {
						elem[ jQuery.camelCase( "default-" + name ) ] =
							elem[ propName ] = false;
					}

				// See #9699 for explanation of this approach (setting first, then removal)
				} else {
					jQuery.attr( elem, name, "" );
				}

				elem.removeAttribute( getSetAttribute ? name : propName );
			}
		}
	}
} );

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {

			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {

			// IE<8 needs the *property* name
			elem.setAttribute( !getSetAttribute && jQuery.propFix[ name ] || name, name );

		} else {

			// Support: IE<9
			// Use defaultChecked and defaultSelected for oldIE
			elem[ jQuery.camelCase( "default-" + name ) ] = elem[ name ] = true;
		}
		return name;
	}
};

jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
	var getter = attrHandle[ name ] || jQuery.find.attr;

	if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
		attrHandle[ name ] = function( elem, name, isXML ) {
			var ret, handle;
			if ( !isXML ) {

				// Avoid an infinite loop by temporarily removing this function from the getter
				handle = attrHandle[ name ];
				attrHandle[ name ] = ret;
				ret = getter( elem, name, isXML ) != null ?
					name.toLowerCase() :
					null;
				attrHandle[ name ] = handle;
			}
			return ret;
		};
	} else {
		attrHandle[ name ] = function( elem, name, isXML ) {
			if ( !isXML ) {
				return elem[ jQuery.camelCase( "default-" + name ) ] ?
					name.toLowerCase() :
					null;
			}
		};
	}
} );

// fix oldIE attroperties
if ( !getSetInput || !getSetAttribute ) {
	jQuery.attrHooks.value = {
		set: function( elem, value, name ) {
			if ( jQuery.nodeName( elem, "input" ) ) {

				// Does not return so that setAttribute is also used
				elem.defaultValue = value;
			} else {

				// Use nodeHook if defined (#1954); otherwise setAttribute is fine
				return nodeHook && nodeHook.set( elem, value, name );
			}
		}
	};
}

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

	// Use this for any attribute in IE6/7
	// This fixes almost every IE6/7 issue
	nodeHook = {
		set: function( elem, value, name ) {

			// Set the existing or create a new attribute node
			var ret = elem.getAttributeNode( name );
			if ( !ret ) {
				elem.setAttributeNode(
					( ret = elem.ownerDocument.createAttribute( name ) )
				);
			}

			ret.value = value += "";

			// Break association with cloned elements by also using setAttribute (#9646)
			if ( name === "value" || value === elem.getAttribute( name ) ) {
				return value;
			}
		}
	};

	// Some attributes are constructed with empty-string values when not defined
	attrHandle.id = attrHandle.name = attrHandle.coords =
		function( elem, name, isXML ) {
			var ret;
			if ( !isXML ) {
				return ( ret = elem.getAttributeNode( name ) ) && ret.value !== "" ?
					ret.value :
					null;
			}
		};

	// Fixing value retrieval on a button requires this module
	jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret = elem.getAttributeNode( name );
			if ( ret && ret.specified ) {
				return ret.value;
			}
		},
		set: nodeHook.set
	};

	// Set contenteditable to false on removals(#10429)
	// Setting to empty string throws an error as an invalid value
	jQuery.attrHooks.contenteditable = {
		set: function( elem, value, name ) {
			nodeHook.set( elem, value === "" ? false : value, name );
		}
	};

	// Set width and height to auto instead of 0 on empty string( Bug #8150 )
	// This is for removals
	jQuery.each( [ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		};
	} );
}

if ( !support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {

			// Return undefined in the case of empty string
			// Note: IE uppercases css property names, but if we were to .toLowerCase()
			// .cssText, that would destroy case sensitivity in URL's, like in "background"
			return elem.style.cssText || undefined;
		},
		set: function( elem, value ) {
			return ( elem.style.cssText = value + "" );
		}
	};
}




var rfocusable = /^(?:input|select|textarea|button|object)$/i,
	rclickable = /^(?:a|area)$/i;

jQuery.fn.extend( {
	prop: function( name, value ) {
		return access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each( function() {

			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch ( e ) {}
		} );
	}
} );

jQuery.extend( {
	prop: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set properties on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {

			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			return ( elem[ name ] = value );
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		return elem[ name ];
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {

				// elem.tabIndex doesn't always return the
				// correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				// Use proper attribute retrieval(#12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				return tabindex ?
					parseInt( tabindex, 10 ) :
					rfocusable.test( elem.nodeName ) ||
						rclickable.test( elem.nodeName ) && elem.href ?
							0 :
							-1;
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	}
} );

// Some attributes require a special call on IE
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !support.hrefNormalized ) {

	// href/src property should get the full normalized URL (#10299/#12915)
	jQuery.each( [ "href", "src" ], function( i, name ) {
		jQuery.propHooks[ name ] = {
			get: function( elem ) {
				return elem.getAttribute( name, 4 );
			}
		};
	} );
}

// Support: Safari, IE9+
// Accessing the selectedIndex property
// forces the browser to respect setting selected
// on the option
// The getter ensures a default option is selected
// when in an optgroup
if ( !support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
			return null;
		},
		set: function( elem ) {
			var parent = elem.parentNode;
			if ( parent ) {
				parent.selectedIndex;

				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
		}
	};
}

jQuery.each( [
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
} );

// IE6/7 call enctype encoding
if ( !support.enctype ) {
	jQuery.propFix.enctype = "encoding";
}




var rclass = /[\t\r\n\f]/g;

function getClass( elem ) {
	return jQuery.attr( elem, "class" ) || "";
}

jQuery.fn.extend( {
	addClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).addClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( typeof value === "string" && value ) {
			classes = value.match( rnotwhite ) || [];

			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );
				cur = elem.nodeType === 1 &&
					( " " + curValue + " " ).replace( rclass, " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}

					// only assign if different to avoid unneeded rendering.
					finalValue = jQuery.trim( cur );
					if ( curValue !== finalValue ) {
						jQuery.attr( elem, "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).removeClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( !arguments.length ) {
			return this.attr( "class", "" );
		}

		if ( typeof value === "string" && value ) {
			classes = value.match( rnotwhite ) || [];

			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );

				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 &&
					( " " + curValue + " " ).replace( rclass, " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {

						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) > -1 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = jQuery.trim( cur );
					if ( curValue !== finalValue ) {
						jQuery.attr( elem, "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value;

		if ( typeof stateVal === "boolean" && type === "string" ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( i ) {
				jQuery( this ).toggleClass(
					value.call( this, i, getClass( this ), stateVal ),
					stateVal
				);
			} );
		}

		return this.each( function() {
			var className, i, self, classNames;

			if ( type === "string" ) {

				// Toggle individual class names
				i = 0;
				self = jQuery( this );
				classNames = value.match( rnotwhite ) || [];

				while ( ( className = classNames[ i++ ] ) ) {

					// Check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( value === undefined || type === "boolean" ) {
				className = getClass( this );
				if ( className ) {

					// store className if set
					jQuery._data( this, "__className__", className );
				}

				// If the element has a class name or if we're passed "false",
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				jQuery.attr( this, "class",
					className || value === false ?
					"" :
					jQuery._data( this, "__className__" ) || ""
				);
			}
		} );
	},

	hasClass: function( selector ) {
		var className, elem,
			i = 0;

		className = " " + selector + " ";
		while ( ( elem = this[ i++ ] ) ) {
			if ( elem.nodeType === 1 &&
				( " " + getClass( elem ) + " " ).replace( rclass, " " )
					.indexOf( className ) > -1
			) {
				return true;
			}
		}

		return false;
	}
} );




// Return jQuery for attributes-only inclusion


jQuery.each( ( "blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu" ).split( " " ),
	function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
} );

jQuery.fn.extend( {
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
} );


var location = window.location;

var nonce = jQuery.now();

var rquery = ( /\?/ );



var rvalidtokens = /(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g;

jQuery.parseJSON = function( data ) {

	// Attempt to parse using the native JSON parser first
	if ( window.JSON && window.JSON.parse ) {

		// Support: Android 2.3
		// Workaround failure to string-cast null input
		return window.JSON.parse( data + "" );
	}

	var requireNonComma,
		depth = null,
		str = jQuery.trim( data + "" );

	// Guard against invalid (and possibly dangerous) input by ensuring that nothing remains
	// after removing valid tokens
	return str && !jQuery.trim( str.replace( rvalidtokens, function( token, comma, open, close ) {

		// Force termination if we see a misplaced comma
		if ( requireNonComma && comma ) {
			depth = 0;
		}

		// Perform no more replacements after returning to outermost depth
		if ( depth === 0 ) {
			return token;
		}

		// Commas must not follow "[", "{", or ","
		requireNonComma = open || comma;

		// Determine new depth
		// array/object open ("[" or "{"): depth += true - false (increment)
		// array/object close ("]" or "}"): depth += false - true (decrement)
		// other cases ("," or primitive): depth += true - true (numeric cast)
		depth += !close - !open;

		// Remove this token
		return "";
	} ) ) ?
		( Function( "return " + str ) )() :
		jQuery.error( "Invalid JSON: " + data );
};


// Cross-browser xml parsing
jQuery.parseXML = function( data ) {
	var xml, tmp;
	if ( !data || typeof data !== "string" ) {
		return null;
	}
	try {
		if ( window.DOMParser ) { // Standard
			tmp = new window.DOMParser();
			xml = tmp.parseFromString( data, "text/xml" );
		} else { // IE
			xml = new window.ActiveXObject( "Microsoft.XMLDOM" );
			xml.async = "false";
			xml.loadXML( data );
		}
	} catch ( e ) {
		xml = undefined;
	}
	if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
		jQuery.error( "Invalid XML: " + data );
	}
	return xml;
};


var
	rhash = /#.*$/,
	rts = /([?&])_=[^&]*/,

	// IE leaves an \r character at EOL
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg,

	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rurl = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat( "*" ),

	// Document location
	ajaxLocation = location.href,

	// Segment location into parts
	ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( rnotwhite ) || [];

		if ( jQuery.isFunction( func ) ) {

			// For each dataType in the dataTypeExpression
			while ( ( dataType = dataTypes[ i++ ] ) ) {

				// Prepend if requested
				if ( dataType.charAt( 0 ) === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					( structure[ dataType ] = structure[ dataType ] || [] ).unshift( func );

				// Otherwise append
				} else {
					( structure[ dataType ] = structure[ dataType ] || [] ).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if ( typeof dataTypeOrTransport === "string" &&
				!seekingTransport && !inspected[ dataTypeOrTransport ] ) {

				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		} );
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var deep, key,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {
	var firstDataType, ct, finalDataType, type,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while ( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "Content-Type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {

		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[ 0 ] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}

		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},

		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

			// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {

								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s[ "throws" ] ) { // jscs:ignore requireDotNotation
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return {
								state: "parsererror",
								error: conv ? e : "No conversion from " + prev + " to " + current
							};
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}

jQuery.extend( {

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: ajaxLocation,
		type: "GET",
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /\bxml\b/,
			html: /\bhtml/,
			json: /\bjson\b/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var

			// Cross-domain detection vars
			parts,

			// Loop variable
			i,

			// URL without anti-cache param
			cacheURL,

			// Response headers as string
			responseHeadersString,

			// timeout handle
			timeoutTimer,

			// To know if global events are to be dispatched
			fireGlobals,

			transport,

			// Response headers
			responseHeaders,

			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),

			// Callbacks context
			callbackContext = s.context || s,

			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context &&
				( callbackContext.nodeType || callbackContext.jquery ) ?
					jQuery( callbackContext ) :
					jQuery.event,

			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks( "once memory" ),

			// Status-dependent callbacks
			statusCode = s.statusCode || {},

			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},

			// The jqXHR state
			state = 0,

			// Default abort message
			strAbort = "canceled",

			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[ 1 ].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					var lname = name.toLowerCase();
					if ( !state ) {
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( state < 2 ) {
							for ( code in map ) {

								// Lazy-add the new callback in a way that preserves old ones
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						} else {

							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR ).complete = completeDeferred.add;
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || ajaxLocation ) + "" )
			.replace( rhash, "" )
			.replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( rnotwhite ) || [ "" ];

		// A cross-domain request is in order when we have a protocol:host:port mismatch
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? "80" : "443" ) ) !==
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? "80" : "443" ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
		fireGlobals = jQuery.event && s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		cacheURL = s.url;

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL = ( s.url += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data );

				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add anti-cache in url if needed
			if ( s.cache === false ) {
				s.url = rts.test( cacheURL ) ?

					// If there is already a '_' parameter, set its value
					cacheURL.replace( rts, "$1_=" + nonce++ ) :

					// Otherwise add one to the end
					cacheURL + ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + nonce++;
			}
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[ 0 ] ] ?
				s.accepts[ s.dataTypes[ 0 ] ] +
					( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend &&
			( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {

			// Abort if not done already and return
			return jqXHR.abort();
		}

		// aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}

			// If request was aborted inside ajaxSend, stop there
			if ( state === 2 ) {
				return jqXHR;
			}

			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = window.setTimeout( function() {
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch ( e ) {

				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );

				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				window.clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader( "Last-Modified" );
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader( "etag" );
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {

				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );

				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
} );

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {

		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		// The url can be an options object (which then must have .url)
		return jQuery.ajax( jQuery.extend( {
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		}, jQuery.isPlainObject( url ) && url ) );
	};
} );


jQuery._evalUrl = function( url ) {
	return jQuery.ajax( {
		url: url,

		// Make this explicit, since user can override this through ajaxSetup (#11264)
		type: "GET",
		dataType: "script",
		cache: true,
		async: false,
		global: false,
		"throws": true
	} );
};


jQuery.fn.extend( {
	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each( function( i ) {
				jQuery( this ).wrapAll( html.call( this, i ) );
			} );
		}

		if ( this[ 0 ] ) {

			// The elements to wrap the target around
			var wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

			if ( this[ 0 ].parentNode ) {
				wrap.insertBefore( this[ 0 ] );
			}

			wrap.map( function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			} ).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each( function( i ) {
				jQuery( this ).wrapInner( html.call( this, i ) );
			} );
		}

		return this.each( function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		} );
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each( function( i ) {
			jQuery( this ).wrapAll( isFunction ? html.call( this, i ) : html );
		} );
	},

	unwrap: function() {
		return this.parent().each( function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		} ).end();
	}
} );


function getDisplay( elem ) {
	return elem.style && elem.style.display || jQuery.css( elem, "display" );
}

function filterHidden( elem ) {

	// Disconnected elements are considered hidden
	if ( !jQuery.contains( elem.ownerDocument || document, elem ) ) {
		return true;
	}
	while ( elem && elem.nodeType === 1 ) {
		if ( getDisplay( elem ) === "none" || elem.type === "hidden" ) {
			return true;
		}
		elem = elem.parentNode;
	}
	return false;
}

jQuery.expr.filters.hidden = function( elem ) {

	// Support: Opera <= 12.12
	// Opera reports offsetWidths and offsetHeights less than zero on some elements
	return support.reliableHiddenOffsets() ?
		( elem.offsetWidth <= 0 && elem.offsetHeight <= 0 &&
			!elem.getClientRects().length ) :
			filterHidden( elem );
};

jQuery.expr.filters.visible = function( elem ) {
	return !jQuery.expr.filters.hidden( elem );
};




var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {

		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {

				// Treat each array item as a scalar.
				add( prefix, v );

			} else {

				// Item is non-scalar (array or object), encode its numeric index.
				buildParams(
					prefix + "[" + ( typeof v === "object" && v != null ? i : "" ) + "]",
					v,
					traditional,
					add
				);
			}
		} );

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {

		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {

		// Serialize scalar item.
		add( prefix, obj );
	}
}

// Serialize an array of form elements or a set of
// key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, value ) {

			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

	// Set traditional to true for jQuery <= 1.3.2 behavior.
	if ( traditional === undefined ) {
		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {

		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		} );

	} else {

		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" ).replace( r20, "+" );
};

jQuery.fn.extend( {
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map( function() {

			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		} )
		.filter( function() {
			var type = this.type;

			// Use .is(":disabled") so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !rcheckableType.test( type ) );
		} )
		.map( function( i, elem ) {
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val ) {
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					} ) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		} ).get();
	}
} );


// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject !== undefined ?

	// Support: IE6-IE8
	function() {

		// XHR cannot access local files, always use ActiveX for that case
		if ( this.isLocal ) {
			return createActiveXHR();
		}

		// Support: IE 9-11
		// IE seems to error on cross-domain PATCH requests when ActiveX XHR
		// is used. In IE 9+ always use the native XHR.
		// Note: this condition won't catch Edge as it doesn't define
		// document.documentMode but it also doesn't support ActiveX so it won't
		// reach this code.
		if ( document.documentMode > 8 ) {
			return createStandardXHR();
		}

		// Support: IE<9
		// oldIE XHR does not support non-RFC2616 methods (#13240)
		// See http://msdn.microsoft.com/en-us/library/ie/ms536648(v=vs.85).aspx
		// and http://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html#sec9
		// Although this check for six methods instead of eight
		// since IE also does not support "trace" and "connect"
		return /^(get|post|head|put|delete|options)$/i.test( this.type ) &&
			createStandardXHR() || createActiveXHR();
	} :

	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

var xhrId = 0,
	xhrCallbacks = {},
	xhrSupported = jQuery.ajaxSettings.xhr();

// Support: IE<10
// Open requests must be manually aborted on unload (#5280)
// See https://support.microsoft.com/kb/2856746 for more info
if ( window.attachEvent ) {
	window.attachEvent( "onunload", function() {
		for ( var key in xhrCallbacks ) {
			xhrCallbacks[ key ]( undefined, true );
		}
	} );
}

// Determine support properties
support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
xhrSupported = support.ajax = !!xhrSupported;

// Create transport if the browser can provide an xhr
if ( xhrSupported ) {

	jQuery.ajaxTransport( function( options ) {

		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !options.crossDomain || support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {
					var i,
						xhr = options.xhr(),
						id = ++xhrId;

					// Open the socket
					xhr.open(
						options.type,
						options.url,
						options.async,
						options.username,
						options.password
					);

					// Apply custom fields if provided
					if ( options.xhrFields ) {
						for ( i in options.xhrFields ) {
							xhr[ i ] = options.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( options.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( options.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !options.crossDomain && !headers[ "X-Requested-With" ] ) {
						headers[ "X-Requested-With" ] = "XMLHttpRequest";
					}

					// Set headers
					for ( i in headers ) {

						// Support: IE<9
						// IE's ActiveXObject throws a 'Type Mismatch' exception when setting
						// request header to a null-value.
						//
						// To keep consistent with other XHR implementations, cast the value
						// to string and ignore `undefined`.
						if ( headers[ i ] !== undefined ) {
							xhr.setRequestHeader( i, headers[ i ] + "" );
						}
					}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( options.hasContent && options.data ) || null );

					// Listener
					callback = function( _, isAbort ) {
						var status, statusText, responses;

						// Was never called and is aborted or complete
						if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

							// Clean up
							delete xhrCallbacks[ id ];
							callback = undefined;
							xhr.onreadystatechange = jQuery.noop;

							// Abort manually if needed
							if ( isAbort ) {
								if ( xhr.readyState !== 4 ) {
									xhr.abort();
								}
							} else {
								responses = {};
								status = xhr.status;

								// Support: IE<10
								// Accessing binary-data responseText throws an exception
								// (#11426)
								if ( typeof xhr.responseText === "string" ) {
									responses.text = xhr.responseText;
								}

								// Firefox throws an exception when accessing
								// statusText for faulty cross-domain requests
								try {
									statusText = xhr.statusText;
								} catch ( e ) {

									// We normalize with Webkit giving an empty statusText
									statusText = "";
								}

								// Filter status for non standard behaviors

								// If the request is local and we have data: assume a success
								// (success with no data won't get notified, that's the best we
								// can do given current implementations)
								if ( !status && options.isLocal && !options.crossDomain ) {
									status = responses.text ? 200 : 404;

								// IE - #1450: sometimes returns 1223 when it should be 204
								} else if ( status === 1223 ) {
									status = 204;
								}
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, xhr.getAllResponseHeaders() );
						}
					};

					// Do send the request
					// `xhr.send` may raise an exception, but it will be
					// handled in jQuery.ajax (so no try/catch here)
					if ( !options.async ) {

						// If we're in sync mode we fire the callback
						callback();
					} else if ( xhr.readyState === 4 ) {

						// (IE6 & IE7) if it's in cache and has been
						// retrieved directly we need to fire the callback
						window.setTimeout( callback );
					} else {

						// Register the callback, but delay it in case `xhr.send` throws
						// Add to the list of active xhr callbacks
						xhr.onreadystatechange = xhrCallbacks[ id ] = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback( undefined, true );
					}
				}
			};
		}
	} );
}

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch ( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject( "Microsoft.XMLHTTP" );
	} catch ( e ) {}
}




// Install script dataType
jQuery.ajaxSetup( {
	accepts: {
		script: "text/javascript, application/javascript, " +
			"application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /\b(?:java|ecma)script\b/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
} );

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
} );

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function( s ) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || jQuery( "head" )[ 0 ] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement( "script" );

				script.async = true;

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( script.parentNode ) {
							script.parentNode.removeChild( script );
						}

						// Dereference the script
						script = null;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};

				// Circumvent IE6 bugs with base elements (#2709 and #4378) by prepending
				// Use native DOM manipulation to avoid our domManip AJAX trickery
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( undefined, true );
				}
			}
		};
	}
} );




var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup( {
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
} );

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" &&
				( s.contentType || "" )
					.indexOf( "application/x-www-form-urlencoded" ) === 0 &&
				rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters[ "script json" ] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always( function() {

			// If previous value didn't exist - remove it
			if ( overwritten === undefined ) {
				jQuery( window ).removeProp( callbackName );

			// Otherwise restore preexisting value
			} else {
				window[ callbackName ] = overwritten;
			}

			// Save back as free
			if ( s[ callbackName ] ) {

				// make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		} );

		// Delegate to script
		return "script";
	}
} );




// data: string of html
// context (optional): If specified, the fragment will be created in this context,
// defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
jQuery.parseHTML = function( data, context, keepScripts ) {
	if ( !data || typeof data !== "string" ) {
		return null;
	}
	if ( typeof context === "boolean" ) {
		keepScripts = context;
		context = false;
	}
	context = context || document;

	var parsed = rsingleTag.exec( data ),
		scripts = !keepScripts && [];

	// Single tag
	if ( parsed ) {
		return [ context.createElement( parsed[ 1 ] ) ];
	}

	parsed = buildFragment( [ data ], context, scripts );

	if ( scripts && scripts.length ) {
		jQuery( scripts ).remove();
	}

	return jQuery.merge( [], parsed.childNodes );
};


// Keep a copy of the old load method
var _load = jQuery.fn.load;

/**
 * Load a url into a page
 */
jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		return _load.apply( this, arguments );
	}

	var selector, type, response,
		self = this,
		off = url.indexOf( " " );

	if ( off > -1 ) {
		selector = jQuery.trim( url.slice( off, url.length ) );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax( {
			url: url,

			// If "type" variable is undefined, then "GET" method will be used.
			// Make value of this field explicit since
			// user can override it through ajaxSetup method
			type: type || "GET",
			dataType: "html",
			data: params
		} ).done( function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery( "<div>" ).append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		// If the request succeeds, this function gets "data", "status", "jqXHR"
		// but they are ignored because response was set above.
		// If it fails, this function gets "jqXHR", "status", "error"
		} ).always( callback && function( jqXHR, status ) {
			self.each( function() {
				callback.apply( this, response || [ jqXHR.responseText, status, jqXHR ] );
			} );
		} );
	}

	return this;
};




// Attach a bunch of functions for handling common AJAX events
jQuery.each( [
	"ajaxStart",
	"ajaxStop",
	"ajaxComplete",
	"ajaxError",
	"ajaxSuccess",
	"ajaxSend"
], function( i, type ) {
	jQuery.fn[ type ] = function( fn ) {
		return this.on( type, fn );
	};
} );




jQuery.expr.filters.animated = function( elem ) {
	return jQuery.grep( jQuery.timers, function( fn ) {
		return elem === fn.elem;
	} ).length;
};





/**
 * Gets a window from an element
 */
function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}

jQuery.offset = {
	setOffset: function( elem, options, i ) {
		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
			position = jQuery.css( elem, "position" ),
			curElem = jQuery( elem ),
			props = {};

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		curOffset = curElem.offset();
		curCSSTop = jQuery.css( elem, "top" );
		curCSSLeft = jQuery.css( elem, "left" );
		calculatePosition = ( position === "absolute" || position === "fixed" ) &&
			jQuery.inArray( "auto", [ curCSSTop, curCSSLeft ] ) > -1;

		// need to be able to calculate position if either top or left
		// is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {

			// Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
			options = options.call( elem, i, jQuery.extend( {}, curOffset ) );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};

jQuery.fn.extend( {
	offset: function( options ) {
		if ( arguments.length ) {
			return options === undefined ?
				this :
				this.each( function( i ) {
					jQuery.offset.setOffset( this, options, i );
				} );
		}

		var docElem, win,
			box = { top: 0, left: 0 },
			elem = this[ 0 ],
			doc = elem && elem.ownerDocument;

		if ( !doc ) {
			return;
		}

		docElem = doc.documentElement;

		// Make sure it's not a disconnected DOM node
		if ( !jQuery.contains( docElem, elem ) ) {
			return box;
		}

		// If we don't have gBCR, just use 0,0 rather than error
		// BlackBerry 5, iOS 3 (original iPhone)
		if ( typeof elem.getBoundingClientRect !== "undefined" ) {
			box = elem.getBoundingClientRect();
		}
		win = getWindow( doc );
		return {
			top: box.top  + ( win.pageYOffset || docElem.scrollTop )  - ( docElem.clientTop  || 0 ),
			left: box.left + ( win.pageXOffset || docElem.scrollLeft ) - ( docElem.clientLeft || 0 )
		};
	},

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			parentOffset = { top: 0, left: 0 },
			elem = this[ 0 ];

		// Fixed elements are offset from window (parentOffset = {top:0, left: 0},
		// because it is its only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {

			// we assume that getBoundingClientRect is available when computed position is fixed
			offset = elem.getBoundingClientRect();
		} else {

			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset.top  += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
			parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
		}

		// Subtract parent offsets and element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		return {
			top:  offset.top  - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
		};
	},

	offsetParent: function() {
		return this.map( function() {
			var offsetParent = this.offsetParent;

			while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) &&
				jQuery.css( offsetParent, "position" ) === "static" ) ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent || documentElement;
		} );
	}
} );

// Create scrollLeft and scrollTop methods
jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
	var top = /Y/.test( prop );

	jQuery.fn[ method ] = function( val ) {
		return access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? ( prop in win ) ? win[ prop ] :
					win.document.documentElement[ method ] :
					elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : jQuery( win ).scrollLeft(),
					top ? val : jQuery( win ).scrollTop()
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
} );

// Support: Safari<7-8+, Chrome<37-44+
// Add the top/left cssHooks using jQuery.fn.position
// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
// getComputedStyle returns percent when specified for top/left/bottom/right
// rather than make the css module depend on the offset module, we just check for it here
jQuery.each( [ "top", "left" ], function( i, prop ) {
	jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
		function( elem, computed ) {
			if ( computed ) {
				computed = curCSS( elem, prop );

				// if curCSS returns percentage, fallback to offset
				return rnumnonpx.test( computed ) ?
					jQuery( elem ).position()[ prop ] + "px" :
					computed;
			}
		}
	);
} );


// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name },
	function( defaultExtra, funcName ) {

		// margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {

					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
					// isn't a whole lot we can do. See pull request at this URL for discussion:
					// https://github.com/jquery/jquery/pull/764
					return elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
					// whichever is greatest
					// unfortunately, this causes bug #3838 in IE6/8 only,
					// but there is currently no good, small way to fix it.
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?

					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable, null );
		};
	} );
} );


jQuery.fn.extend( {

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {

		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ?
			this.off( selector, "**" ) :
			this.off( types, selector || "**", fn );
	}
} );

// The number of elements contained in the matched element set
jQuery.fn.size = function() {
	return this.length;
};

jQuery.fn.andSelf = jQuery.fn.addBack;




// Register as a named AMD module, since jQuery can be concatenated with other
// files that may use define, but not via a proper concatenation script that
// understands anonymous AMD modules. A named AMD is safest and most robust
// way to register. Lowercase jquery is used because AMD module names are
// derived from file names, and jQuery is normally delivered in a lowercase
// file name. Do this after creating the global so that if an AMD module wants
// to call noConflict to hide this version of jQuery, it will work.

// Note that for maximum portability, libraries that are not jQuery should
// declare themselves as anonymous modules, and avoid setting a global if an
// AMD loader is present. jQuery is a special case. For more information, see
// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

if ( typeof define === "function" && define.amd ) {
	define( "jquery", [], function() {
		return jQuery;
	} );
}



var

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$;

jQuery.noConflict = function( deep ) {
	if ( window.$ === jQuery ) {
		window.$ = _$;
	}

	if ( deep && window.jQuery === jQuery ) {
		window.jQuery = _jQuery;
	}

	return jQuery;
};

// Expose jQuery and $ identifiers, even in
// AMD (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
// and CommonJS for browser emulators (#13566)
if ( !noGlobal ) {
	window.jQuery = window.$ = jQuery;
}

return jQuery;
}));
(function($, undefined) {

/**
 * Unobtrusive scripting adapter for jQuery
 * https://github.com/rails/jquery-ujs
 *
 * Requires jQuery 1.8.0 or later.
 *
 * Released under the MIT license
 *
 */

  // Cut down on the number of issues from people inadvertently including jquery_ujs twice
  // by detecting and raising an error when it happens.
  'use strict';

  if ( $.rails !== undefined ) {
    $.error('jquery-ujs has already been loaded!');
  }

  // Shorthand to make it a little easier to call public rails functions from within rails.js
  var rails;
  var $document = $(document);

  $.rails = rails = {
    // Link elements bound by jquery-ujs
    linkClickSelector: 'a[data-confirm], a[data-method], a[data-remote]:not([disabled]), a[data-disable-with], a[data-disable]',

    // Button elements bound by jquery-ujs
    buttonClickSelector: 'button[data-remote]:not([form]):not(form button), button[data-confirm]:not([form]):not(form button)',

    // Select elements bound by jquery-ujs
    inputChangeSelector: 'select[data-remote], input[data-remote], textarea[data-remote]',

    // Form elements bound by jquery-ujs
    formSubmitSelector: 'form',

    // Form input elements bound by jquery-ujs
    formInputClickSelector: 'form input[type=submit], form input[type=image], form button[type=submit], form button:not([type]), input[type=submit][form], input[type=image][form], button[type=submit][form], button[form]:not([type])',

    // Form input elements disabled during form submission
    disableSelector: 'input[data-disable-with]:enabled, button[data-disable-with]:enabled, textarea[data-disable-with]:enabled, input[data-disable]:enabled, button[data-disable]:enabled, textarea[data-disable]:enabled',

    // Form input elements re-enabled after form submission
    enableSelector: 'input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled, input[data-disable]:disabled, button[data-disable]:disabled, textarea[data-disable]:disabled',

    // Form required input elements
    requiredInputSelector: 'input[name][required]:not([disabled]), textarea[name][required]:not([disabled])',

    // Form file input elements
    fileInputSelector: 'input[name][type=file]:not([disabled])',

    // Link onClick disable selector with possible reenable after remote submission
    linkDisableSelector: 'a[data-disable-with], a[data-disable]',

    // Button onClick disable selector with possible reenable after remote submission
    buttonDisableSelector: 'button[data-remote][data-disable-with], button[data-remote][data-disable]',

    // Up-to-date Cross-Site Request Forgery token
    csrfToken: function() {
     return $('meta[name=csrf-token]').attr('content');
    },

    // URL param that must contain the CSRF token
    csrfParam: function() {
     return $('meta[name=csrf-param]').attr('content');
    },

    // Make sure that every Ajax request sends the CSRF token
    CSRFProtection: function(xhr) {
      var token = rails.csrfToken();
      if (token) xhr.setRequestHeader('X-CSRF-Token', token);
    },

    // Make sure that all forms have actual up-to-date tokens (cached forms contain old ones)
    refreshCSRFTokens: function(){
      $('form input[name="' + rails.csrfParam() + '"]').val(rails.csrfToken());
    },

    // Triggers an event on an element and returns false if the event result is false
    fire: function(obj, name, data) {
      var event = $.Event(name);
      obj.trigger(event, data);
      return event.result !== false;
    },

    // Default confirm dialog, may be overridden with custom confirm dialog in $.rails.confirm
    confirm: function(message) {
      return confirm(message);
    },

    // Default ajax function, may be overridden with custom function in $.rails.ajax
    ajax: function(options) {
      return $.ajax(options);
    },

    // Default way to get an element's href. May be overridden at $.rails.href.
    href: function(element) {
      return element[0].href;
    },

    // Checks "data-remote" if true to handle the request through a XHR request.
    isRemote: function(element) {
      return element.data('remote') !== undefined && element.data('remote') !== false;
    },

    // Submits "remote" forms and links with ajax
    handleRemote: function(element) {
      var method, url, data, withCredentials, dataType, options;

      if (rails.fire(element, 'ajax:before')) {
        withCredentials = element.data('with-credentials') || null;
        dataType = element.data('type') || ($.ajaxSettings && $.ajaxSettings.dataType);

        if (element.is('form')) {
          method = element.data('ujs:submit-button-formmethod') || element.attr('method');
          url = element.data('ujs:submit-button-formaction') || element.attr('action');
          data = $(element[0]).serializeArray();
          // memoized value from clicked submit button
          var button = element.data('ujs:submit-button');
          if (button) {
            data.push(button);
            element.data('ujs:submit-button', null);
          }
          element.data('ujs:submit-button-formmethod', null);
          element.data('ujs:submit-button-formaction', null);
        } else if (element.is(rails.inputChangeSelector)) {
          method = element.data('method');
          url = element.data('url');
          data = element.serialize();
          if (element.data('params')) data = data + '&' + element.data('params');
        } else if (element.is(rails.buttonClickSelector)) {
          method = element.data('method') || 'get';
          url = element.data('url');
          data = element.serialize();
          if (element.data('params')) data = data + '&' + element.data('params');
        } else {
          method = element.data('method');
          url = rails.href(element);
          data = element.data('params') || null;
        }

        options = {
          type: method || 'GET', data: data, dataType: dataType,
          // stopping the "ajax:beforeSend" event will cancel the ajax request
          beforeSend: function(xhr, settings) {
            if (settings.dataType === undefined) {
              xhr.setRequestHeader('accept', '*/*;q=0.5, ' + settings.accepts.script);
            }
            if (rails.fire(element, 'ajax:beforeSend', [xhr, settings])) {
              element.trigger('ajax:send', xhr);
            } else {
              return false;
            }
          },
          success: function(data, status, xhr) {
            element.trigger('ajax:success', [data, status, xhr]);
          },
          complete: function(xhr, status) {
            element.trigger('ajax:complete', [xhr, status]);
          },
          error: function(xhr, status, error) {
            element.trigger('ajax:error', [xhr, status, error]);
          },
          crossDomain: rails.isCrossDomain(url)
        };

        // There is no withCredentials for IE6-8 when
        // "Enable native XMLHTTP support" is disabled
        if (withCredentials) {
          options.xhrFields = {
            withCredentials: withCredentials
          };
        }

        // Only pass url to `ajax` options if not blank
        if (url) { options.url = url; }

        return rails.ajax(options);
      } else {
        return false;
      }
    },

    // Determines if the request is a cross domain request.
    isCrossDomain: function(url) {
      var originAnchor = document.createElement('a');
      originAnchor.href = location.href;
      var urlAnchor = document.createElement('a');

      try {
        urlAnchor.href = url;
        // This is a workaround to a IE bug.
        urlAnchor.href = urlAnchor.href;

        // If URL protocol is false or is a string containing a single colon
        // *and* host are false, assume it is not a cross-domain request
        // (should only be the case for IE7 and IE compatibility mode).
        // Otherwise, evaluate protocol and host of the URL against the origin
        // protocol and host.
        return !(((!urlAnchor.protocol || urlAnchor.protocol === ':') && !urlAnchor.host) ||
          (originAnchor.protocol + '//' + originAnchor.host ===
            urlAnchor.protocol + '//' + urlAnchor.host));
      } catch (e) {
        // If there is an error parsing the URL, assume it is crossDomain.
        return true;
      }
    },

    // Handles "data-method" on links such as:
    // <a href="/users/5" data-method="delete" rel="nofollow" data-confirm="Are you sure?">Delete</a>
    handleMethod: function(link) {
      var href = rails.href(link),
        method = link.data('method'),
        target = link.attr('target'),
        csrfToken = rails.csrfToken(),
        csrfParam = rails.csrfParam(),
        form = $('<form method="post" action="' + href + '"></form>'),
        metadataInput = '<input name="_method" value="' + method + '" type="hidden" />';

      if (csrfParam !== undefined && csrfToken !== undefined && !rails.isCrossDomain(href)) {
        metadataInput += '<input name="' + csrfParam + '" value="' + csrfToken + '" type="hidden" />';
      }

      if (target) { form.attr('target', target); }

      form.hide().append(metadataInput).appendTo('body');
      form.submit();
    },

    // Helper function that returns form elements that match the specified CSS selector
    // If form is actually a "form" element this will return associated elements outside the from that have
    // the html form attribute set
    formElements: function(form, selector) {
      return form.is('form') ? $(form[0].elements).filter(selector) : form.find(selector);
    },

    /* Disables form elements:
      - Caches element value in 'ujs:enable-with' data store
      - Replaces element text with value of 'data-disable-with' attribute
      - Sets disabled property to true
    */
    disableFormElements: function(form) {
      rails.formElements(form, rails.disableSelector).each(function() {
        rails.disableFormElement($(this));
      });
    },

    disableFormElement: function(element) {
      var method, replacement;

      method = element.is('button') ? 'html' : 'val';
      replacement = element.data('disable-with');

      if (replacement !== undefined) {
        element.data('ujs:enable-with', element[method]());
        element[method](replacement);
      }

      element.prop('disabled', true);
      element.data('ujs:disabled', true);
    },

    /* Re-enables disabled form elements:
      - Replaces element text with cached value from 'ujs:enable-with' data store (created in `disableFormElements`)
      - Sets disabled property to false
    */
    enableFormElements: function(form) {
      rails.formElements(form, rails.enableSelector).each(function() {
        rails.enableFormElement($(this));
      });
    },

    enableFormElement: function(element) {
      var method = element.is('button') ? 'html' : 'val';
      if (element.data('ujs:enable-with') !== undefined) {
        element[method](element.data('ujs:enable-with'));
        element.removeData('ujs:enable-with'); // clean up cache
      }
      element.prop('disabled', false);
      element.removeData('ujs:disabled');
    },

   /* For 'data-confirm' attribute:
      - Fires `confirm` event
      - Shows the confirmation dialog
      - Fires the `confirm:complete` event

      Returns `true` if no function stops the chain and user chose yes; `false` otherwise.
      Attaching a handler to the element's `confirm` event that returns a `falsy` value cancels the confirmation dialog.
      Attaching a handler to the element's `confirm:complete` event that returns a `falsy` value makes this function
      return false. The `confirm:complete` event is fired whether or not the user answered true or false to the dialog.
   */
    allowAction: function(element) {
      var message = element.data('confirm'),
          answer = false, callback;
      if (!message) { return true; }

      if (rails.fire(element, 'confirm')) {
        try {
          answer = rails.confirm(message);
        } catch (e) {
          (console.error || console.log).call(console, e.stack || e);
        }
        callback = rails.fire(element, 'confirm:complete', [answer]);
      }
      return answer && callback;
    },

    // Helper function which checks for blank inputs in a form that match the specified CSS selector
    blankInputs: function(form, specifiedSelector, nonBlank) {
      var foundInputs = $(),
        input,
        valueToCheck,
        radiosForNameWithNoneSelected,
        radioName,
        selector = specifiedSelector || 'input,textarea',
        requiredInputs = form.find(selector),
        checkedRadioButtonNames = {};

      requiredInputs.each(function() {
        input = $(this);
        if (input.is('input[type=radio]')) {

          // Don't count unchecked required radio as blank if other radio with same name is checked,
          // regardless of whether same-name radio input has required attribute or not. The spec
          // states https://www.w3.org/TR/html5/forms.html#the-required-attribute
          radioName = input.attr('name');

          // Skip if we've already seen the radio with this name.
          if (!checkedRadioButtonNames[radioName]) {

            // If none checked
            if (form.find('input[type=radio]:checked[name="' + radioName + '"]').length === 0) {
              radiosForNameWithNoneSelected = form.find(
                'input[type=radio][name="' + radioName + '"]');
              foundInputs = foundInputs.add(radiosForNameWithNoneSelected);
            }

            // We only need to check each name once.
            checkedRadioButtonNames[radioName] = radioName;
          }
        } else {
          valueToCheck = input.is('input[type=checkbox],input[type=radio]') ? input.is(':checked') : !!input.val();
          if (valueToCheck === nonBlank) {
            foundInputs = foundInputs.add(input);
          }
        }
      });
      return foundInputs.length ? foundInputs : false;
    },

    // Helper function which checks for non-blank inputs in a form that match the specified CSS selector
    nonBlankInputs: function(form, specifiedSelector) {
      return rails.blankInputs(form, specifiedSelector, true); // true specifies nonBlank
    },

    // Helper function, needed to provide consistent behavior in IE
    stopEverything: function(e) {
      $(e.target).trigger('ujs:everythingStopped');
      e.stopImmediatePropagation();
      return false;
    },

    //  Replace element's html with the 'data-disable-with' after storing original html
    //  and prevent clicking on it
    disableElement: function(element) {
      var replacement = element.data('disable-with');

      if (replacement !== undefined) {
        element.data('ujs:enable-with', element.html()); // store enabled state
        element.html(replacement);
      }

      element.bind('click.railsDisable', function(e) { // prevent further clicking
        return rails.stopEverything(e);
      });
      element.data('ujs:disabled', true);
    },

    // Restore element to its original state which was disabled by 'disableElement' above
    enableElement: function(element) {
      if (element.data('ujs:enable-with') !== undefined) {
        element.html(element.data('ujs:enable-with')); // set to old enabled state
        element.removeData('ujs:enable-with'); // clean up cache
      }
      element.unbind('click.railsDisable'); // enable element
      element.removeData('ujs:disabled');
    }
  };

  if (rails.fire($document, 'rails:attachBindings')) {

    $.ajaxPrefilter(function(options, originalOptions, xhr){ if ( !options.crossDomain ) { rails.CSRFProtection(xhr); }});

    // This event works the same as the load event, except that it fires every
    // time the page is loaded.
    //
    // See https://github.com/rails/jquery-ujs/issues/357
    // See https://developer.mozilla.org/en-US/docs/Using_Firefox_1.5_caching
    $(window).on('pageshow.rails', function () {
      $($.rails.enableSelector).each(function () {
        var element = $(this);

        if (element.data('ujs:disabled')) {
          $.rails.enableFormElement(element);
        }
      });

      $($.rails.linkDisableSelector).each(function () {
        var element = $(this);

        if (element.data('ujs:disabled')) {
          $.rails.enableElement(element);
        }
      });
    });

    $document.on('ajax:complete', rails.linkDisableSelector, function() {
        rails.enableElement($(this));
    });

    $document.on('ajax:complete', rails.buttonDisableSelector, function() {
        rails.enableFormElement($(this));
    });

    $document.on('click.rails', rails.linkClickSelector, function(e) {
      var link = $(this), method = link.data('method'), data = link.data('params'), metaClick = e.metaKey || e.ctrlKey;
      if (!rails.allowAction(link)) return rails.stopEverything(e);

      if (!metaClick && link.is(rails.linkDisableSelector)) rails.disableElement(link);

      if (rails.isRemote(link)) {
        if (metaClick && (!method || method === 'GET') && !data) { return true; }

        var handleRemote = rails.handleRemote(link);
        // Response from rails.handleRemote() will either be false or a deferred object promise.
        if (handleRemote === false) {
          rails.enableElement(link);
        } else {
          handleRemote.fail( function() { rails.enableElement(link); } );
        }
        return false;

      } else if (method) {
        rails.handleMethod(link);
        return false;
      }
    });

    $document.on('click.rails', rails.buttonClickSelector, function(e) {
      var button = $(this);

      if (!rails.allowAction(button) || !rails.isRemote(button)) return rails.stopEverything(e);

      if (button.is(rails.buttonDisableSelector)) rails.disableFormElement(button);

      var handleRemote = rails.handleRemote(button);
      // Response from rails.handleRemote() will either be false or a deferred object promise.
      if (handleRemote === false) {
        rails.enableFormElement(button);
      } else {
        handleRemote.fail( function() { rails.enableFormElement(button); } );
      }
      return false;
    });

    $document.on('change.rails', rails.inputChangeSelector, function(e) {
      var link = $(this);
      if (!rails.allowAction(link) || !rails.isRemote(link)) return rails.stopEverything(e);

      rails.handleRemote(link);
      return false;
    });

    $document.on('submit.rails', rails.formSubmitSelector, function(e) {
      var form = $(this),
        remote = rails.isRemote(form),
        blankRequiredInputs,
        nonBlankFileInputs;

      if (!rails.allowAction(form)) return rails.stopEverything(e);

      // Skip other logic when required values are missing or file upload is present
      if (form.attr('novalidate') === undefined) {
        if (form.data('ujs:formnovalidate-button') === undefined) {
          blankRequiredInputs = rails.blankInputs(form, rails.requiredInputSelector, false);
          if (blankRequiredInputs && rails.fire(form, 'ajax:aborted:required', [blankRequiredInputs])) {
            return rails.stopEverything(e);
          }
        } else {
          // Clear the formnovalidate in case the next button click is not on a formnovalidate button
          // Not strictly necessary to do here, since it is also reset on each button click, but just to be certain
          form.data('ujs:formnovalidate-button', undefined);
        }
      }

      if (remote) {
        nonBlankFileInputs = rails.nonBlankInputs(form, rails.fileInputSelector);
        if (nonBlankFileInputs) {
          // Slight timeout so that the submit button gets properly serialized
          // (make it easy for event handler to serialize form without disabled values)
          setTimeout(function(){ rails.disableFormElements(form); }, 13);
          var aborted = rails.fire(form, 'ajax:aborted:file', [nonBlankFileInputs]);

          // Re-enable form elements if event bindings return false (canceling normal form submission)
          if (!aborted) { setTimeout(function(){ rails.enableFormElements(form); }, 13); }

          return aborted;
        }

        rails.handleRemote(form);
        return false;

      } else {
        // Slight timeout so that the submit button gets properly serialized
        setTimeout(function(){ rails.disableFormElements(form); }, 13);
      }
    });

    $document.on('click.rails', rails.formInputClickSelector, function(event) {
      var button = $(this);

      if (!rails.allowAction(button)) return rails.stopEverything(event);

      // Register the pressed submit button
      var name = button.attr('name'),
        data = name ? {name:name, value:button.val()} : null;

      var form = button.closest('form');
      if (form.length === 0) {
        form = $('#' + button.attr('form'));
      }
      form.data('ujs:submit-button', data);

      // Save attributes from button
      form.data('ujs:formnovalidate-button', button.attr('formnovalidate'));
      form.data('ujs:submit-button-formaction', button.attr('formaction'));
      form.data('ujs:submit-button-formmethod', button.attr('formmethod'));
    });

    $document.on('ajax:send.rails', rails.formSubmitSelector, function(event) {
      if (this === event.target) rails.disableFormElements($(this));
    });

    $document.on('ajax:complete.rails', rails.formSubmitSelector, function(event) {
      if (this === event.target) rails.enableFormElements($(this));
    });

    $(function(){
      rails.refreshCSRFTokens();
    });
  }

})( jQuery );
(function() {


}).call(this);
(function() {


}).call(this);
(function() {


}).call(this);
(function() {


}).call(this);
(function() {


}).call(this);
(function() {


}).call(this);
!function(e){function t(r){if(n[r])return n[r].exports;var o=n[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,t),o.l=!0,o.exports}var n={};t.m=e,t.c=n,t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:r})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=169)}([function(e,t,n){"use strict";e.exports=n(24)},function(e,t,n){"use strict";function r(e,t,n,r,a,i,u,s){if(o(t),!e){var l;if(void 0===t)l=new Error("Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.");else{var c=[n,r,a,i,u,s],f=0;l=new Error(t.replace(/%s/g,function(){return c[f++]})),l.name="Invariant Violation"}throw l.framesToPop=1,l}}var o=function(e){};e.exports=r},function(e,t,n){"use strict";var r=n(11),o=r;e.exports=o},function(e,t,n){"use strict";function r(e){for(var t=arguments.length-1,n="Minified React error #"+e+"; visit http://facebook.github.io/react/docs/error-decoder.html?invariant="+e,r=0;r<t;r++)n+="&args[]="+encodeURIComponent(arguments[r+1]);n+=" for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";var o=new Error(n);throw o.name="Invariant Violation",o.framesToPop=1,o}e.exports=r},function(e,t,n){"use strict";function r(e){if(null===e||void 0===e)throw new TypeError("Object.assign cannot be called with null or undefined");return Object(e)}/*
object-assign
(c) Sindre Sorhus
@license MIT
*/
var o=Object.getOwnPropertySymbols,a=Object.prototype.hasOwnProperty,i=Object.prototype.propertyIsEnumerable;e.exports=function(){try{if(!Object.assign)return!1;var e=new String("abc");if(e[5]="de","5"===Object.getOwnPropertyNames(e)[0])return!1;for(var t={},n=0;n<10;n++)t["_"+String.fromCharCode(n)]=n;if("0123456789"!==Object.getOwnPropertyNames(t).map(function(e){return t[e]}).join(""))return!1;var r={};return"abcdefghijklmnopqrst".split("").forEach(function(e){r[e]=e}),"abcdefghijklmnopqrst"===Object.keys(Object.assign({},r)).join("")}catch(e){return!1}}()?Object.assign:function(e,t){for(var n,u,s=r(e),l=1;l<arguments.length;l++){n=Object(arguments[l]);for(var c in n)a.call(n,c)&&(s[c]=n[c]);if(o){u=o(n);for(var f=0;f<u.length;f++)i.call(n,u[f])&&(s[u[f]]=n[u[f]])}}return s}},function(e,t,n){e.exports=n(262)()},function(e,t,n){"use strict";function r(e,t){return 1===e.nodeType&&e.getAttribute(h)===String(t)||8===e.nodeType&&e.nodeValue===" react-text: "+t+" "||8===e.nodeType&&e.nodeValue===" react-empty: "+t+" "}function o(e){for(var t;t=e._renderedComponent;)e=t;return e}function a(e,t){var n=o(e);n._hostNode=t,t[v]=n}function i(e){var t=e._hostNode;t&&(delete t[v],e._hostNode=null)}function u(e,t){if(!(e._flags&y.hasCachedChildNodes)){var n=e._renderedChildren,i=t.firstChild;e:for(var u in n)if(n.hasOwnProperty(u)){var s=n[u],l=o(s)._domID;if(0!==l){for(;null!==i;i=i.nextSibling)if(r(i,l)){a(s,i);continue e}f("32",l)}}e._flags|=y.hasCachedChildNodes}}function s(e){if(e[v])return e[v];for(var t=[];!e[v];){if(t.push(e),!e.parentNode)return null;e=e.parentNode}for(var n,r;e&&(r=e[v]);e=t.pop())n=r,t.length&&u(r,e);return n}function l(e){var t=s(e);return null!=t&&t._hostNode===e?t:null}function c(e){if(void 0===e._hostNode&&f("33"),e._hostNode)return e._hostNode;for(var t=[];!e._hostNode;)t.push(e),e._hostParent||f("34"),e=e._hostParent;for(;t.length;e=t.pop())u(e,e._hostNode);return e._hostNode}var f=n(3),p=n(26),d=n(98),h=(n(1),p.ID_ATTRIBUTE_NAME),y=d,v="__reactInternalInstance$"+Math.random().toString(36).slice(2),m={getClosestInstanceFromNode:s,getInstanceFromNode:l,getNodeFromInstance:c,precacheChildNodes:u,precacheNode:a,uncacheNode:i};e.exports=m},function(e,t,n){"use strict";var r=function(){};e.exports=r},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(285);n.d(t,"BrowserRouter",function(){return r.a});var o=n(287);n.d(t,"HashRouter",function(){return o.a});var a=n(136);n.d(t,"Link",function(){return a.a});var i=n(289);n.d(t,"MemoryRouter",function(){return i.a});var u=n(292);n.d(t,"NavLink",function(){return u.a});var s=n(295);n.d(t,"Prompt",function(){return s.a});var l=n(297);n.d(t,"Redirect",function(){return l.a});var c=n(137);n.d(t,"Route",function(){return c.a});var f=n(79);n.d(t,"Router",function(){return f.a});var p=n(303);n.d(t,"StaticRouter",function(){return p.a});var d=n(305);n.d(t,"Switch",function(){return d.a});var h=n(307);n.d(t,"matchPath",function(){return h.a});var y=n(308);n.d(t,"withRouter",function(){return y.a})},function(e,t,n){"use strict";var r=!("undefined"==typeof window||!window.document||!window.document.createElement),o={canUseDOM:r,canUseWorkers:"undefined"!=typeof Worker,canUseEventListeners:r&&!(!window.addEventListener&&!window.attachEvent),canUseViewport:r&&!!window.screen,isInWorker:!r};e.exports=o},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(261),o=n(125),a=n(264);n.d(t,"Provider",function(){return r.b}),n.d(t,"createProvider",function(){return r.a}),n.d(t,"connectAdvanced",function(){return o.a}),n.d(t,"connect",function(){return a.a})},function(e,t,n){"use strict";function r(e){return function(){return e}}var o=function(){};o.thatReturns=r,o.thatReturnsFalse=r(!1),o.thatReturnsTrue=r(!0),o.thatReturnsNull=r(null),o.thatReturnsThis=function(){return this},o.thatReturnsArgument=function(e){return e},e.exports=o},function(e,t,n){"use strict";var r=function(e,t,n,r,o,a,i,u){if(!e){var s;if(void 0===t)s=new Error("Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.");else{var l=[n,r,o,a,i,u],c=0;s=new Error(t.replace(/%s/g,function(){return l[c++]})),s.name="Invariant Violation"}throw s.framesToPop=1,s}};e.exports=r},function(e,t,n){"use strict";var r=null;e.exports={debugTool:r}},function(e,t,n){"use strict";function r(){k.ReactReconcileTransaction&&w||c("123")}function o(){this.reinitializeTransaction(),this.dirtyComponentsLength=null,this.callbackQueue=p.getPooled(),this.reconcileTransaction=k.ReactReconcileTransaction.getPooled(!0)}function a(e,t,n,o,a,i){return r(),w.batchedUpdates(e,t,n,o,a,i)}function i(e,t){return e._mountOrder-t._mountOrder}function u(e){var t=e.dirtyComponentsLength;t!==m.length&&c("124",t,m.length),m.sort(i),g++;for(var n=0;n<t;n++){var r=m[n],o=r._pendingCallbacks;r._pendingCallbacks=null;var a;if(h.logTopLevelRenders){var u=r;r._currentElement.type.isReactTopLevelWrapper&&(u=r._renderedComponent),a="React update: "+u.getName(),console.time(a)}if(y.performUpdateIfNecessary(r,e.reconcileTransaction,g),a&&console.timeEnd(a),o)for(var s=0;s<o.length;s++)e.callbackQueue.enqueue(o[s],r.getPublicInstance())}}function s(e){if(r(),!w.isBatchingUpdates)return void w.batchedUpdates(s,e);m.push(e),null==e._updateBatchNumber&&(e._updateBatchNumber=g+1)}function l(e,t){w.isBatchingUpdates||c("125"),b.enqueue(e,t),_=!0}var c=n(3),f=n(4),p=n(102),d=n(22),h=n(103),y=n(27),v=n(42),m=(n(1),[]),g=0,b=p.getPooled(),_=!1,w=null,E={initialize:function(){this.dirtyComponentsLength=m.length},close:function(){this.dirtyComponentsLength!==m.length?(m.splice(0,this.dirtyComponentsLength),C()):m.length=0}},O={initialize:function(){this.callbackQueue.reset()},close:function(){this.callbackQueue.notifyAll()}},P=[E,O];f(o.prototype,v,{getTransactionWrappers:function(){return P},destructor:function(){this.dirtyComponentsLength=null,p.release(this.callbackQueue),this.callbackQueue=null,k.ReactReconcileTransaction.release(this.reconcileTransaction),this.reconcileTransaction=null},perform:function(e,t,n){return v.perform.call(this,this.reconcileTransaction.perform,this.reconcileTransaction,e,t,n)}}),d.addPoolingTo(o);var C=function(){for(;m.length||_;){if(m.length){var e=o.getPooled();e.perform(u,null,e),o.release(e)}if(_){_=!1;var t=b;b=p.getPooled(),t.notifyAll(),p.release(t)}}},x={injectReconcileTransaction:function(e){e||c("126"),k.ReactReconcileTransaction=e},injectBatchingStrategy:function(e){e||c("127"),"function"!=typeof e.batchedUpdates&&c("128"),"boolean"!=typeof e.isBatchingUpdates&&c("129"),w=e}},k={ReactReconcileTransaction:null,batchedUpdates:a,enqueueUpdate:s,flushBatchedUpdates:C,injection:x,asap:l};e.exports=k},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.unfollowPlaylist=t.followPlaylist=t.deletePlaylist=t.updatePlaylist=t.createPlaylist=t.fetchPlaylist=t.fetchPlaylists=t.receiveUnfollowPlaylist=t.receiveFollowPlaylist=t.receivePlaylistErrors=t.removePlaylist=t.receivePlaylist=t.receivePlaylists=t.UNFOLLOW_PLAYLIST=t.FOLLOW_PLAYLIST=t.RECEIVE_PLAYLIST_ERRORS=t.REMOVE_PLAYLIST=t.RECEIVE_PLAYLIST=t.RECEIVE_PLAYLISTS=void 0;var r=n(323),o=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}(r),a=t.RECEIVE_PLAYLISTS="RECEIVE_PLAYLISTS",i=t.RECEIVE_PLAYLIST="RECEIVE_PLAYLIST",u=t.REMOVE_PLAYLIST="REMOVE_PLAYLIST",s=t.RECEIVE_PLAYLIST_ERRORS="RECEIVE_PLAYLIST_ERRORS",l=t.FOLLOW_PLAYLIST="FOLLOW_PLAYLIST",c=t.UNFOLLOW_PLAYLIST="UNFOLLOW_PLAYLIST",f=t.receivePlaylists=function(e){return{type:a,playlists:e}},p=t.receivePlaylist=function(e){return{type:i,playlist:e}},d=t.removePlaylist=function(e){return{type:u,playlist:e}},h=t.receivePlaylistErrors=function(e){return{type:s,errors:e}},y=t.receiveFollowPlaylist=function(e){return{type:l,playlist:e}},v=t.receiveUnfollowPlaylist=function(e){return{type:c,playlist:e}};t.fetchPlaylists=function(){return function(e){return o.fetchPlaylists().then(function(t){return e(f(t))},function(t){return e(h(t.responseJSON))})}},t.fetchPlaylist=function(e){return function(t){return o.fetchPlaylist(e).then(function(e){return t(p(e))},function(e){return t(h(e.responseJSON))})}},t.createPlaylist=function(e){return function(t){return o.createPlaylist(e).then(function(e){return t(p(e))},function(e){return t(h(e.responseJSON))})}},t.updatePlaylist=function(e){return function(t){return o.updatePlaylist(e).then(function(e){return t(p(e))},function(e){return t(h(e.responseJSON))})}},t.deletePlaylist=function(e){return function(t){return o.deletePlaylist(e).then(function(e){return t(d(e))},function(e){return t(h(e.responseJSON))})}},t.followPlaylist=function(e){return function(t){return o.followPlaylist(e).then(function(e){return t(y(e))},function(e){return t(h(e.responseJSON))})}},t.unfollowPlaylist=function(e){return function(t){return o.unfollowPlaylist(e).then(function(e){return t(v(e))},function(e){return t(h(e.responseJSON))})}}},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e){var t=e.match(m);if(t){var n=t[1];if(n.match(g))return i(n);if(b.test(n))return parseInt(n,10)}return 0}function i(e){for(var t=0,n=g.exec(e);null!==n;){var r=n,o=f(r,3),a=o[1],i=o[2];"h"===i&&(t+=60*parseInt(a,10)*60),"m"===i&&(t+=60*parseInt(a,10)),"s"===i&&(t+=parseInt(a,10)),n=g.exec(e)}return t}function u(){return Math.random().toString(36).substr(2,5)}function s(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:null,r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:function(){return!0};return window[t]&&r(window[t])?Promise.resolve(window[t]):new Promise(function(r,o){if(n){var a=window[n];window[n]=function(){a&&a(),r(window[t])}}(0,d.default)(e,function(e){e&&o(e),n||r(window[t])})})}function l(e,t,n){var r=(0,y.default)(t.config,e.config),a=!0,i=!1,u=void 0;try{for(var s,l=v.DEPRECATED_CONFIG_PROPS[Symbol.iterator]();!(a=(s=l.next()).done);a=!0){var c=s.value;if(e[c]){var f=c.replace(/Config$/,"");if(r=(0,y.default)(r,o({},f,e[c])),n){var p="ReactPlayer: %c"+c+" %cis deprecated, please use the config prop instead – https://github.com/CookPete/react-player#config-prop";console.warn(p,"font-weight: bold","")}}}}catch(e){i=!0,u=e}finally{try{!a&&l.return&&l.return()}finally{if(i)throw u}}return r}function c(e){for(var t,n=arguments.length,r=Array(n>1?n-1:0),o=1;o<n;o++)r[o-1]=arguments[o];var a=(t=[]).concat.apply(t,r),i={},u=Object.keys(e),s=!0,l=!1,c=void 0;try{for(var f,p=u[Symbol.iterator]();!(s=(f=p.next()).done);s=!0){var d=f.value;-1===a.indexOf(d)&&(i[d]=e[d])}}catch(e){l=!0,c=e}finally{try{!s&&p.return&&p.return()}finally{if(l)throw c}}return i}Object.defineProperty(t,"__esModule",{value:!0});var f=function(){function e(e,t){var n=[],r=!0,o=!1,a=void 0;try{for(var i,u=e[Symbol.iterator]();!(r=(i=u.next()).done)&&(n.push(i.value),!t||n.length!==t);r=!0);}catch(e){o=!0,a=e}finally{try{!r&&u.return&&u.return()}finally{if(o)throw a}}return n}return function(t,n){if(Array.isArray(t))return t;if(Symbol.iterator in Object(t))return e(t,n);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}();t.parseStartTime=a,t.randomString=u,t.getSDK=s,t.getConfig=l,t.omit=c;var p=n(427),d=r(p),h=n(428),y=r(h),v=n(90),m=/[?&#](?:start|t)=([0-9hms]+)/,g=/(\d+)(h|m|s)/g,b=/^\d+$/},function(e,t,n){"use strict";var r={current:null};e.exports=r},function(e,t,n){"use strict";function r(e,t,n,r){this.dispatchConfig=e,this._targetInst=t,this.nativeEvent=n;var o=this.constructor.Interface;for(var a in o)if(o.hasOwnProperty(a)){var u=o[a];u?this[a]=u(n):"target"===a?this.target=r:this[a]=n[a]}var s=null!=n.defaultPrevented?n.defaultPrevented:!1===n.returnValue;return this.isDefaultPrevented=s?i.thatReturnsTrue:i.thatReturnsFalse,this.isPropagationStopped=i.thatReturnsFalse,this}var o=n(4),a=n(22),i=n(11),u=(n(2),["dispatchConfig","_targetInst","nativeEvent","isDefaultPrevented","isPropagationStopped","_dispatchListeners","_dispatchInstances"]),s={type:null,target:null,currentTarget:i.thatReturnsNull,eventPhase:null,bubbles:null,cancelable:null,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:null,isTrusted:null};o(r.prototype,{preventDefault:function(){this.defaultPrevented=!0;var e=this.nativeEvent;e&&(e.preventDefault?e.preventDefault():"unknown"!=typeof e.returnValue&&(e.returnValue=!1),this.isDefaultPrevented=i.thatReturnsTrue)},stopPropagation:function(){var e=this.nativeEvent;e&&(e.stopPropagation?e.stopPropagation():"unknown"!=typeof e.cancelBubble&&(e.cancelBubble=!0),this.isPropagationStopped=i.thatReturnsTrue)},persist:function(){this.isPersistent=i.thatReturnsTrue},isPersistent:i.thatReturnsFalse,destructor:function(){var e=this.constructor.Interface;for(var t in e)this[t]=null;for(var n=0;n<u.length;n++)this[u[n]]=null}}),r.Interface=s,r.augmentClass=function(e,t){var n=this,r=function(){};r.prototype=n.prototype;var i=new r;o(i,e.prototype),e.prototype=i,e.prototype.constructor=e,e.Interface=o({},n.Interface,t),e.augmentClass=n.augmentClass,a.addPoolingTo(e,a.fourArgumentPooler)},a.addPoolingTo(r,a.fourArgumentPooler),e.exports=r},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),u=n(0),s=n(90),l=function(e){function t(){var e,n,a,i;r(this,t);for(var u=arguments.length,s=Array(u),l=0;l<u;l++)s[l]=arguments[l];return n=a=o(this,(e=t.__proto__||Object.getPrototypeOf(t)).call.apply(e,[this].concat(s))),a.isReady=!1,a.startOnPlay=!0,a.seekOnPlay=null,a.onPlay=function(){var e=a.props,t=e.volume,n=e.muted,r=e.onStart,o=e.onPlay,i=e.playbackRate;a.startOnPlay&&(a.setPlaybackRate&&a.setPlaybackRate(i),a.setVolume(n?0:t),r(),a.startOnPlay=!1),o(),a.seekOnPlay&&(a.seekTo(a.seekOnPlay),a.seekOnPlay=null),a.onDurationCheck()},a.onReady=function(){var e=a.props,t=e.onReady,n=e.playing;a.isReady=!0,a.loadingSDK=!1,t(),(n||a.preloading)&&(a.preloading=!1,a.loadOnReady?(a.load(a.loadOnReady),a.loadOnReady=null):a.play()),a.onDurationCheck()},a.onDurationCheck=function(){clearTimeout(a.durationCheckTimeout);var e=a.getDuration();e?a.props.onDuration(e):a.durationCheckTimeout=setTimeout(a.onDurationCheck,100)},i=n,o(a,i)}return a(t,e),i(t,[{key:"componentDidMount",value:function(){var e=this.props.url;this.mounted=!0,e&&this.load(e)}},{key:"componentWillUnmount",value:function(){this.stop(),this.mounted=!1}},{key:"componentWillReceiveProps",value:function(e){var t=this.props,n=t.url,r=t.playing,o=t.volume,a=t.muted,i=t.playbackRate;n!==e.url&&e.url&&(this.seekOnPlay=null,this.startOnPlay=!0,this.load(e.url)),n&&!e.url&&(this.stop(),clearTimeout(this.updateTimeout)),!r&&e.playing&&this.play(),r&&!e.playing&&this.pause(),o===e.volume||e.muted||this.setVolume(e.volume),a!==e.muted&&this.setVolume(e.muted?0:e.volume),i!==e.playbackRate&&this.setPlaybackRate&&this.setPlaybackRate(e.playbackRate)}},{key:"shouldComponentUpdate",value:function(e){return this.props.url!==e.url}},{key:"callPlayer",value:function(e){var t;if(!this.isReady||!this.player||!this.player[e]){var n="ReactPlayer: "+this.constructor.displayName+" player could not call %c"+e+"%c – ";return this.isReady?this.player?this.player[e]||(n+="The method was not available"):n+="The player was not available":n+="The player was not ready",console.warn(n,"font-weight: bold",""),null}for(var r=arguments.length,o=Array(r>1?r-1:0),a=1;a<r;a++)o[a-1]=arguments[a];return(t=this.player)[e].apply(t,o)}},{key:"seekTo",value:function(e){var t=this;return this.isReady||0===e||(this.seekOnPlay=e,setTimeout(function(){t.seekOnPlay=null},5e3)),e>0&&e<1?this.getDuration()*e:e}}]),t}(u.Component);l.propTypes=s.propTypes,l.defaultProps=s.defaultProps,t.default=l},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.logout=t.login=t.signup=t.receiveSessionErrors=t.receiveCurrentUser=t.RECEIVE_SESSION_ERRORS=t.RECEIVE_CURRENT_USER=void 0;var r=n(315),o=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}(r),a=t.RECEIVE_CURRENT_USER="RECEIVE_CURRENT_USER",i=t.RECEIVE_SESSION_ERRORS="RECEIVE_SESSION_ERRORS",u=t.receiveCurrentUser=function(e){return{type:a,currentUser:e}},s=t.receiveSessionErrors=function(e){return{type:i,errors:e}};t.signup=function(e){return function(t){return o.signup(e).then(function(e){return t(u(e))},function(e){return t(s(e.responseJSON))})}},t.login=function(e){return function(t){return o.login(e).then(function(e){return t(u(e))},function(e){return t(s(e.responseJSON))})}},t.logout=function(){return function(e){return o.logout().then(function(t){return e(u(null))},function(t){return e(s(t.responseJSON))})}}},function(e,t,n){var r=n(345),o=n(402),a=o(function(e,t,n){r(e,t,n)});e.exports=a},function(e,t,n){"use strict";var r=n(3),o=(n(1),function(e){var t=this;if(t.instancePool.length){var n=t.instancePool.pop();return t.call(n,e),n}return new t(e)}),a=function(e,t){var n=this;if(n.instancePool.length){var r=n.instancePool.pop();return n.call(r,e,t),r}return new n(e,t)},i=function(e,t,n){var r=this;if(r.instancePool.length){var o=r.instancePool.pop();return r.call(o,e,t,n),o}return new r(e,t,n)},u=function(e,t,n,r){var o=this;if(o.instancePool.length){var a=o.instancePool.pop();return o.call(a,e,t,n,r),a}return new o(e,t,n,r)},s=function(e){var t=this;e instanceof t||r("25"),e.destructor(),t.instancePool.length<t.poolSize&&t.instancePool.push(e)},l=o,c=function(e,t){var n=e;return n.instancePool=[],n.getPooled=t||l,n.poolSize||(n.poolSize=10),n.release=s,n},f={addPoolingTo:c,oneArgumentPooler:o,twoArgumentPooler:a,threeArgumentPooler:i,fourArgumentPooler:u};e.exports=f},function(e,t){function n(e){var t=typeof e;return null!=e&&("object"==t||"function"==t)}e.exports=n},function(e,t,n){"use strict";var r=n(4),o=n(91),a=n(171),i=n(176),u=n(25),s=n(177),l=n(180),c=n(181),f=n(183),p=u.createElement,d=u.createFactory,h=u.cloneElement,y=r,v=function(e){return e},m={Children:{map:a.map,forEach:a.forEach,count:a.count,toArray:a.toArray,only:f},Component:o.Component,PureComponent:o.PureComponent,createElement:p,cloneElement:h,isValidElement:u.isValidElement,PropTypes:s,createClass:c,createFactory:d,createMixin:v,DOM:i,version:l,__spread:y};e.exports=m},function(e,t,n){"use strict";function r(e){return void 0!==e.ref}function o(e){return void 0!==e.key}var a=n(4),i=n(17),u=(n(2),n(93),Object.prototype.hasOwnProperty),s=n(94),l={key:!0,ref:!0,__self:!0,__source:!0},c=function(e,t,n,r,o,a,i){var u={$$typeof:s,type:e,key:t,ref:n,props:i,_owner:a};return u};c.createElement=function(e,t,n){var a,s={},f=null,p=null;if(null!=t){r(t)&&(p=t.ref),o(t)&&(f=""+t.key),void 0===t.__self?null:t.__self,void 0===t.__source?null:t.__source;for(a in t)u.call(t,a)&&!l.hasOwnProperty(a)&&(s[a]=t[a])}var d=arguments.length-2;if(1===d)s.children=n;else if(d>1){for(var h=Array(d),y=0;y<d;y++)h[y]=arguments[y+2];s.children=h}if(e&&e.defaultProps){var v=e.defaultProps;for(a in v)void 0===s[a]&&(s[a]=v[a])}return c(e,f,p,0,0,i.current,s)},c.createFactory=function(e){var t=c.createElement.bind(null,e);return t.type=e,t},c.cloneAndReplaceKey=function(e,t){return c(e.type,t,e.ref,e._self,e._source,e._owner,e.props)},c.cloneElement=function(e,t,n){var s,f=a({},e.props),p=e.key,d=e.ref,h=(e._self,e._source,e._owner);if(null!=t){r(t)&&(d=t.ref,h=i.current),o(t)&&(p=""+t.key);var y;e.type&&e.type.defaultProps&&(y=e.type.defaultProps);for(s in t)u.call(t,s)&&!l.hasOwnProperty(s)&&(void 0===t[s]&&void 0!==y?f[s]=y[s]:f[s]=t[s])}var v=arguments.length-2;if(1===v)f.children=n;else if(v>1){for(var m=Array(v),g=0;g<v;g++)m[g]=arguments[g+2];f.children=m}return c(e.type,p,d,0,0,h,f)},c.isValidElement=function(e){return"object"==typeof e&&null!==e&&e.$$typeof===s},e.exports=c},function(e,t,n){"use strict";function r(e,t){return(e&t)===t}var o=n(3),a=(n(1),{MUST_USE_PROPERTY:1,HAS_BOOLEAN_VALUE:4,HAS_NUMERIC_VALUE:8,HAS_POSITIVE_NUMERIC_VALUE:24,HAS_OVERLOADED_BOOLEAN_VALUE:32,injectDOMPropertyConfig:function(e){var t=a,n=e.Properties||{},i=e.DOMAttributeNamespaces||{},s=e.DOMAttributeNames||{},l=e.DOMPropertyNames||{},c=e.DOMMutationMethods||{};e.isCustomAttribute&&u._isCustomAttributeFunctions.push(e.isCustomAttribute);for(var f in n){u.properties.hasOwnProperty(f)&&o("48",f);var p=f.toLowerCase(),d=n[f],h={attributeName:p,attributeNamespace:null,propertyName:f,mutationMethod:null,mustUseProperty:r(d,t.MUST_USE_PROPERTY),hasBooleanValue:r(d,t.HAS_BOOLEAN_VALUE),hasNumericValue:r(d,t.HAS_NUMERIC_VALUE),hasPositiveNumericValue:r(d,t.HAS_POSITIVE_NUMERIC_VALUE),hasOverloadedBooleanValue:r(d,t.HAS_OVERLOADED_BOOLEAN_VALUE)};if(h.hasBooleanValue+h.hasNumericValue+h.hasOverloadedBooleanValue<=1||o("50",f),s.hasOwnProperty(f)){var y=s[f];h.attributeName=y}i.hasOwnProperty(f)&&(h.attributeNamespace=i[f]),l.hasOwnProperty(f)&&(h.propertyName=l[f]),c.hasOwnProperty(f)&&(h.mutationMethod=c[f]),u.properties[f]=h}}}),i=":A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD",u={ID_ATTRIBUTE_NAME:"data-reactid",ROOT_ATTRIBUTE_NAME:"data-reactroot",ATTRIBUTE_NAME_START_CHAR:i,ATTRIBUTE_NAME_CHAR:i+"\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040",properties:{},getPossibleStandardName:null,_isCustomAttributeFunctions:[],isCustomAttribute:function(e){for(var t=0;t<u._isCustomAttributeFunctions.length;t++){if((0,u._isCustomAttributeFunctions[t])(e))return!0}return!1},injection:a};e.exports=u},function(e,t,n){"use strict";function r(){o.attachRefs(this,this._currentElement)}var o=n(192),a=(n(13),n(2),{mountComponent:function(e,t,n,o,a,i){var u=e.mountComponent(t,n,o,a,i);return e._currentElement&&null!=e._currentElement.ref&&t.getReactMountReady().enqueue(r,e),u},getHostNode:function(e){return e.getHostNode()},unmountComponent:function(e,t){o.detachRefs(e,e._currentElement),e.unmountComponent(t)},receiveComponent:function(e,t,n,a){var i=e._currentElement;if(t!==i||a!==e._context){var u=o.shouldUpdateRefs(i,t);u&&o.detachRefs(e,i),e.receiveComponent(t,n,a),u&&e._currentElement&&null!=e._currentElement.ref&&n.getReactMountReady().enqueue(r,e)}},performUpdateIfNecessary:function(e,t,n){e._updateBatchNumber===n&&e.performUpdateIfNecessary(t)}});e.exports=a},function(e,t,n){"use strict";function r(e){if(h){var t=e.node,n=e.children;if(n.length)for(var r=0;r<n.length;r++)y(t,n[r],null);else null!=e.html?f(t,e.html):null!=e.text&&d(t,e.text)}}function o(e,t){e.parentNode.replaceChild(t.node,e),r(t)}function a(e,t){h?e.children.push(t):e.node.appendChild(t.node)}function i(e,t){h?e.html=t:f(e.node,t)}function u(e,t){h?e.text=t:d(e.node,t)}function s(){return this.node.nodeName}function l(e){return{node:e,children:[],html:null,text:null,toString:s}}var c=n(65),f=n(44),p=n(66),d=n(107),h="undefined"!=typeof document&&"number"==typeof document.documentMode||"undefined"!=typeof navigator&&"string"==typeof navigator.userAgent&&/\bEdge\/\d/.test(navigator.userAgent),y=p(function(e,t,n){11===t.node.nodeType||1===t.node.nodeType&&"object"===t.node.nodeName.toLowerCase()&&(null==t.node.namespaceURI||t.node.namespaceURI===c.html)?(r(t),e.insertBefore(t.node,n)):(e.insertBefore(t.node,n),r(t))});l.insertTreeBefore=y,l.replaceChildWithTree=o,l.queueChild=a,l.queueHTML=i,l.queueText=u,e.exports=l},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.fetchUser=t.unfriendUser=t.friendUser=t.receiveUser=t.receiveFriendshipErrors=t.receiveUnfriendUser=t.receiveFriendUser=t.RECEIVE_FRIENDSHIP_ERRORS=t.RECEIVE_USER=t.UNFRIEND_USER=t.FRIEND_USER=void 0;var r=n(326),o=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}(r),a=t.FRIEND_USER="FRIEND_USER",i=t.UNFRIEND_USER="UNFRIEND_USER",u=t.RECEIVE_USER="RECEIVE_USER",s=t.RECEIVE_FRIENDSHIP_ERRORS="RECEIVE_FRIENDSHIP_ERRORS",l=t.receiveFriendUser=function(e){return{type:a,user:e}},c=t.receiveUnfriendUser=function(e){return{type:i,user:e}},f=t.receiveFriendshipErrors=function(e){return{type:s,errors:e}},p=t.receiveUser=function(e){return{type:u,user:e}};t.friendUser=function(e){return function(t){return o.friendUser(e).then(function(e){return t(l(e))},function(e){return t(f(e.responseJSON))})}},t.unfriendUser=function(e){return function(t){return o.unfriendUser(e).then(function(e){return t(c(e))},function(e){return t(f(e.responseJSON))})}},t.fetchUser=function(e){return function(t){return o.fetchUser(e).then(function(e){return t(p(e))},function(e){return t(f(e.responseJSON))})}}},function(e,t,n){var r=n(152),o="object"==typeof self&&self&&self.Object===Object&&self,a=r||o||Function("return this")();e.exports=a},function(e,t,n){"use strict";function r(e){for(var t=arguments.length-1,n="Minified React error #"+e+"; visit http://facebook.github.io/react/docs/error-decoder.html?invariant="+e,r=0;r<t;r++)n+="&args[]="+encodeURIComponent(arguments[r+1]);n+=" for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";var o=new Error(n);throw o.name="Invariant Violation",o.framesToPop=1,o}e.exports=r},function(e,t,n){"use strict";function r(e,t,n){var r=t.dispatchConfig.phasedRegistrationNames[n];return m(e,r)}function o(e,t,n){var o=r(e,n,t);o&&(n._dispatchListeners=y(n._dispatchListeners,o),n._dispatchInstances=y(n._dispatchInstances,e))}function a(e){e&&e.dispatchConfig.phasedRegistrationNames&&h.traverseTwoPhase(e._targetInst,o,e)}function i(e){if(e&&e.dispatchConfig.phasedRegistrationNames){var t=e._targetInst,n=t?h.getParentInstance(t):null;h.traverseTwoPhase(n,o,e)}}function u(e,t,n){if(n&&n.dispatchConfig.registrationName){var r=n.dispatchConfig.registrationName,o=m(e,r);o&&(n._dispatchListeners=y(n._dispatchListeners,o),n._dispatchInstances=y(n._dispatchInstances,e))}}function s(e){e&&e.dispatchConfig.registrationName&&u(e._targetInst,null,e)}function l(e){v(e,a)}function c(e){v(e,i)}function f(e,t,n,r){h.traverseEnterLeave(n,r,u,e,t)}function p(e){v(e,s)}var d=n(33),h=n(59),y=n(99),v=n(100),m=(n(2),d.getListener),g={accumulateTwoPhaseDispatches:l,accumulateTwoPhaseDispatchesSkipTarget:c,accumulateDirectDispatches:p,accumulateEnterLeaveDispatches:f};e.exports=g},function(e,t,n){"use strict";function r(e){return"button"===e||"input"===e||"select"===e||"textarea"===e}function o(e,t,n){switch(e){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":return!(!n.disabled||!r(t));default:return!1}}var a=n(3),i=n(58),u=n(59),s=n(60),l=n(99),c=n(100),f=(n(1),{}),p=null,d=function(e,t){e&&(u.executeDispatchesInOrder(e,t),e.isPersistent()||e.constructor.release(e))},h=function(e){return d(e,!0)},y=function(e){return d(e,!1)},v=function(e){return"."+e._rootNodeID},m={injection:{injectEventPluginOrder:i.injectEventPluginOrder,injectEventPluginsByName:i.injectEventPluginsByName},putListener:function(e,t,n){"function"!=typeof n&&a("94",t,typeof n);var r=v(e);(f[t]||(f[t]={}))[r]=n;var o=i.registrationNameModules[t];o&&o.didPutListener&&o.didPutListener(e,t,n)},getListener:function(e,t){var n=f[t];if(o(t,e._currentElement.type,e._currentElement.props))return null;var r=v(e);return n&&n[r]},deleteListener:function(e,t){var n=i.registrationNameModules[t];n&&n.willDeleteListener&&n.willDeleteListener(e,t);var r=f[t];if(r){delete r[v(e)]}},deleteAllListeners:function(e){var t=v(e);for(var n in f)if(f.hasOwnProperty(n)&&f[n][t]){var r=i.registrationNameModules[n];r&&r.willDeleteListener&&r.willDeleteListener(e,n),delete f[n][t]}},extractEvents:function(e,t,n,r){for(var o,a=i.plugins,u=0;u<a.length;u++){var s=a[u];if(s){var c=s.extractEvents(e,t,n,r);c&&(o=l(o,c))}}return o},enqueueEvents:function(e){e&&(p=l(p,e))},processEventQueue:function(e){var t=p;p=null,e?c(t,h):c(t,y),p&&a("95"),s.rethrowCaughtError()},__purge:function(){f={}},__getListenerBank:function(){return f}};e.exports=m},function(e,t,n){"use strict";function r(e,t,n,r){return o.call(this,e,t,n,r)}var o=n(18),a=n(61),i={view:function(e){if(e.view)return e.view;var t=a(e);if(t.window===t)return t;var n=t.ownerDocument;return n?n.defaultView||n.parentWindow:window},detail:function(e){return e.detail||0}};o.augmentClass(r,i),e.exports=r},function(e,t,n){"use strict";var r={remove:function(e){e._reactInternalInstance=void 0},get:function(e){return e._reactInternalInstance},has:function(e){return void 0!==e._reactInternalInstance},set:function(e,t){e._reactInternalInstance=t}};e.exports=r},function(e,t){var n;n=function(){return this}();try{n=n||Function("return this")()||(0,eval)("this")}catch(e){"object"==typeof window&&(n=window)}e.exports=n},function(e,t){e.exports=function(e){return e.webpackPolyfill||(e.deprecate=function(){},e.paths=[],e.children||(e.children=[]),Object.defineProperty(e,"loaded",{enumerable:!0,get:function(){return e.l}}),Object.defineProperty(e,"id",{enumerable:!0,get:function(){return e.i}}),e.webpackPolyfill=1),e}},function(e,t,n){"use strict";t.__esModule=!0;var r=(t.addLeadingSlash=function(e){return"/"===e.charAt(0)?e:"/"+e},t.stripLeadingSlash=function(e){return"/"===e.charAt(0)?e.substr(1):e},t.hasBasename=function(e,t){return new RegExp("^"+t+"(\\/|\\?|#|$)","i").test(e)});t.stripBasename=function(e,t){return r(e,t)?e.substr(t.length):e},t.stripTrailingSlash=function(e){return"/"===e.charAt(e.length-1)?e.slice(0,-1):e},t.parsePath=function(e){var t=e||"/",n="",r="",o=t.indexOf("#");-1!==o&&(r=t.substr(o),t=t.substr(0,o));var a=t.indexOf("?");return-1!==a&&(n=t.substr(a),t=t.substr(0,a)),{pathname:t,search:"?"===n?"":n,hash:"#"===r?"":r}},t.createPath=function(e){var t=e.pathname,n=e.search,r=e.hash,o=t||"/";return n&&"?"!==n&&(o+="?"===n.charAt(0)?n:"?"+n),r&&"#"!==r&&(o+="#"===r.charAt(0)?r:"#"+r),o}},function(e,t,n){"use strict";n.d(t,"a",function(){return r}),n.d(t,"f",function(){return o}),n.d(t,"c",function(){return a}),n.d(t,"e",function(){return i}),n.d(t,"g",function(){return u}),n.d(t,"d",function(){return s}),n.d(t,"b",function(){return l});var r=function(e){return"/"===e.charAt(0)?e:"/"+e},o=function(e){return"/"===e.charAt(0)?e.substr(1):e},a=function(e,t){return new RegExp("^"+t+"(\\/|\\?|#|$)","i").test(e)},i=function(e,t){return a(e,t)?e.substr(t.length):e},u=function(e){return"/"===e.charAt(e.length-1)?e.slice(0,-1):e},s=function(e){var t=e||"/",n="",r="",o=t.indexOf("#");-1!==o&&(r=t.substr(o),t=t.substr(0,o));var a=t.indexOf("?");return-1!==a&&(n=t.substr(a),t=t.substr(0,a)),{pathname:t,search:"?"===n?"":n,hash:"#"===r?"":r}},l=function(e){var t=e.pathname,n=e.search,r=e.hash,o=t||"/";return n&&"?"!==n&&(o+="?"===n.charAt(0)?n:"?"+n),r&&"#"!==r&&(o+="#"===r.charAt(0)?r:"#"+r),o}},function(e,t){function n(e){return null!=e&&"object"==typeof e}e.exports=n},function(e,t,n){"use strict";var r={};e.exports=r},function(e,t,n){"use strict";var r=n(3),o=(n(1),{}),a={reinitializeTransaction:function(){this.transactionWrappers=this.getTransactionWrappers(),this.wrapperInitData?this.wrapperInitData.length=0:this.wrapperInitData=[],this._isInTransaction=!1},_isInTransaction:!1,getTransactionWrappers:null,isInTransaction:function(){return!!this._isInTransaction},perform:function(e,t,n,o,a,i,u,s){this.isInTransaction()&&r("27");var l,c;try{this._isInTransaction=!0,l=!0,this.initializeAll(0),c=e.call(t,n,o,a,i,u,s),l=!1}finally{try{if(l)try{this.closeAll(0)}catch(e){}else this.closeAll(0)}finally{this._isInTransaction=!1}}return c},initializeAll:function(e){for(var t=this.transactionWrappers,n=e;n<t.length;n++){var r=t[n];try{this.wrapperInitData[n]=o,this.wrapperInitData[n]=r.initialize?r.initialize.call(this):null}finally{if(this.wrapperInitData[n]===o)try{this.initializeAll(n+1)}catch(e){}}}},closeAll:function(e){this.isInTransaction()||r("28");for(var t=this.transactionWrappers,n=e;n<t.length;n++){var a,i=t[n],u=this.wrapperInitData[n];try{a=!0,u!==o&&i.close&&i.close.call(this,u),a=!1}finally{if(a)try{this.closeAll(n+1)}catch(e){}}}this.wrapperInitData.length=0}};e.exports=a},function(e,t,n){"use strict";function r(e,t,n,r){return o.call(this,e,t,n,r)}var o=n(34),a=n(106),i=n(63),u={screenX:null,screenY:null,clientX:null,clientY:null,ctrlKey:null,shiftKey:null,altKey:null,metaKey:null,getModifierState:i,button:function(e){var t=e.button;return"which"in e?t:2===t?2:4===t?1:0},buttons:null,relatedTarget:function(e){return e.relatedTarget||(e.fromElement===e.srcElement?e.toElement:e.fromElement)},pageX:function(e){return"pageX"in e?e.pageX:e.clientX+a.currentScrollLeft},pageY:function(e){return"pageY"in e?e.pageY:e.clientY+a.currentScrollTop}};o.augmentClass(r,u),e.exports=r},function(e,t,n){"use strict";var r,o=n(9),a=n(65),i=/^[ \r\n\t\f]/,u=/<(!--|link|noscript|meta|script|style)[ \r\n\t\f\/>]/,s=n(66),l=s(function(e,t){if(e.namespaceURI!==a.svg||"innerHTML"in e)e.innerHTML=t;else{r=r||document.createElement("div"),r.innerHTML="<svg>"+t+"</svg>";for(var n=r.firstChild;n.firstChild;)e.appendChild(n.firstChild)}});if(o.canUseDOM){var c=document.createElement("div");c.innerHTML=" ",""===c.innerHTML&&(l=function(e,t){if(e.parentNode&&e.parentNode.replaceChild(e,e),i.test(t)||"<"===t[0]&&u.test(t)){e.innerHTML=String.fromCharCode(65279)+t;var n=e.firstChild;1===n.data.length?e.removeChild(n):n.deleteData(0,1)}else e.innerHTML=t}),c=null}e.exports=l},function(e,t,n){"use strict";function r(e){var t=""+e,n=a.exec(t);if(!n)return t;var r,o="",i=0,u=0;for(i=n.index;i<t.length;i++){switch(t.charCodeAt(i)){case 34:r="&quot;";break;case 38:r="&amp;";break;case 39:r="&#x27;";break;case 60:r="&lt;";break;case 62:r="&gt;";break;default:continue}u!==i&&(o+=t.substring(u,i)),u=i+1,o+=r}return u!==i?o+t.substring(u,i):o}function o(e){return"boolean"==typeof e||"number"==typeof e?""+e:r(e)}var a=/["'&<>]/;e.exports=o},function(e,t,n){"use strict";function r(e){return Object.prototype.hasOwnProperty.call(e,y)||(e[y]=d++,f[e[y]]={}),f[e[y]]}var o,a=n(4),i=n(58),u=n(213),s=n(106),l=n(214),c=n(62),f={},p=!1,d=0,h={topAbort:"abort",topAnimationEnd:l("animationend")||"animationend",topAnimationIteration:l("animationiteration")||"animationiteration",topAnimationStart:l("animationstart")||"animationstart",topBlur:"blur",topCanPlay:"canplay",topCanPlayThrough:"canplaythrough",topChange:"change",topClick:"click",topCompositionEnd:"compositionend",topCompositionStart:"compositionstart",topCompositionUpdate:"compositionupdate",topContextMenu:"contextmenu",topCopy:"copy",topCut:"cut",topDoubleClick:"dblclick",topDrag:"drag",topDragEnd:"dragend",topDragEnter:"dragenter",topDragExit:"dragexit",topDragLeave:"dragleave",topDragOver:"dragover",topDragStart:"dragstart",topDrop:"drop",topDurationChange:"durationchange",topEmptied:"emptied",topEncrypted:"encrypted",topEnded:"ended",topError:"error",topFocus:"focus",topInput:"input",topKeyDown:"keydown",topKeyPress:"keypress",topKeyUp:"keyup",topLoadedData:"loadeddata",topLoadedMetadata:"loadedmetadata",topLoadStart:"loadstart",topMouseDown:"mousedown",topMouseMove:"mousemove",topMouseOut:"mouseout",topMouseOver:"mouseover",topMouseUp:"mouseup",topPaste:"paste",topPause:"pause",topPlay:"play",topPlaying:"playing",topProgress:"progress",topRateChange:"ratechange",topScroll:"scroll",topSeeked:"seeked",topSeeking:"seeking",topSelectionChange:"selectionchange",topStalled:"stalled",topSuspend:"suspend",topTextInput:"textInput",topTimeUpdate:"timeupdate",topTouchCancel:"touchcancel",topTouchEnd:"touchend",topTouchMove:"touchmove",topTouchStart:"touchstart",topTransitionEnd:l("transitionend")||"transitionend",topVolumeChange:"volumechange",topWaiting:"waiting",topWheel:"wheel"},y="_reactListenersID"+String(Math.random()).slice(2),v=a({},u,{ReactEventListener:null,injection:{injectReactEventListener:function(e){e.setHandleTopLevel(v.handleTopLevel),v.ReactEventListener=e}},setEnabled:function(e){v.ReactEventListener&&v.ReactEventListener.setEnabled(e)},isEnabled:function(){return!(!v.ReactEventListener||!v.ReactEventListener.isEnabled())},listenTo:function(e,t){for(var n=t,o=r(n),a=i.registrationNameDependencies[e],u=0;u<a.length;u++){var s=a[u];o.hasOwnProperty(s)&&o[s]||("topWheel"===s?c("wheel")?v.ReactEventListener.trapBubbledEvent("topWheel","wheel",n):c("mousewheel")?v.ReactEventListener.trapBubbledEvent("topWheel","mousewheel",n):v.ReactEventListener.trapBubbledEvent("topWheel","DOMMouseScroll",n):"topScroll"===s?c("scroll",!0)?v.ReactEventListener.trapCapturedEvent("topScroll","scroll",n):v.ReactEventListener.trapBubbledEvent("topScroll","scroll",v.ReactEventListener.WINDOW_HANDLE):"topFocus"===s||"topBlur"===s?(c("focus",!0)?(v.ReactEventListener.trapCapturedEvent("topFocus","focus",n),v.ReactEventListener.trapCapturedEvent("topBlur","blur",n)):c("focusin")&&(v.ReactEventListener.trapBubbledEvent("topFocus","focusin",n),v.ReactEventListener.trapBubbledEvent("topBlur","focusout",n)),o.topBlur=!0,o.topFocus=!0):h.hasOwnProperty(s)&&v.ReactEventListener.trapBubbledEvent(s,h[s],n),o[s]=!0)}},trapBubbledEvent:function(e,t,n){return v.ReactEventListener.trapBubbledEvent(e,t,n)},trapCapturedEvent:function(e,t,n){return v.ReactEventListener.trapCapturedEvent(e,t,n)},supportsEventPageXY:function(){if(!document.createEvent)return!1;var e=document.createEvent("MouseEvent");return null!=e&&"pageX"in e},ensureScrollValueMonitoring:function(){if(void 0===o&&(o=v.supportsEventPageXY()),!o&&!p){var e=s.refreshScrollValues;v.ReactEventListener.monitorScrollValue(e),p=!0}}});e.exports=v},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(127),o=n(278),a=n(279),i=n(280),u=n(130);n(129);n.d(t,"createStore",function(){return r.b}),n.d(t,"combineReducers",function(){return o.a}),n.d(t,"bindActionCreators",function(){return a.a}),n.d(t,"applyMiddleware",function(){return i.a}),n.d(t,"compose",function(){return u.a})},function(e,t,n){"use strict";n.d(t,"a",function(){return u}),n.d(t,"b",function(){return s});var r=n(133),o=n(134),a=n(39),i=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},u=function(e,t,n,o){var u=void 0;"string"==typeof e?(u=Object(a.d)(e),u.state=t):(u=i({},e),void 0===u.pathname&&(u.pathname=""),u.search?"?"!==u.search.charAt(0)&&(u.search="?"+u.search):u.search="",u.hash?"#"!==u.hash.charAt(0)&&(u.hash="#"+u.hash):u.hash="",void 0!==t&&void 0===u.state&&(u.state=t));try{u.pathname=decodeURI(u.pathname)}catch(e){throw e instanceof URIError?new URIError('Pathname "'+u.pathname+'" could not be decoded. This is likely caused by an invalid percent-encoding.'):e}return n&&(u.key=n),o?u.pathname?"/"!==u.pathname.charAt(0)&&(u.pathname=Object(r.default)(u.pathname,o.pathname)):u.pathname=o.pathname:u.pathname||(u.pathname="/"),u},s=function(e,t){return e.pathname===t.pathname&&e.search===t.search&&e.hash===t.hash&&e.key===t.key&&Object(o.default)(e.state,t.state)}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.PLAYLIST_COLLECTION="PLAYLIST_COLLECTION",t.SEARCH_COLLECTION="SEARCH_COLLECTION"},function(e,t,n){function r(e){var t=-1,n=null==e?0:e.length;for(this.clear();++t<n;){var r=e[t];this.set(r[0],r[1])}}var o=n(347),a=n(348),i=n(349),u=n(350),s=n(351);r.prototype.clear=o,r.prototype.delete=a,r.prototype.get=i,r.prototype.has=u,r.prototype.set=s,e.exports=r},function(e,t,n){function r(e,t){for(var n=e.length;n--;)if(o(e[n][0],t))return n;return-1}var o=n(52);e.exports=r},function(e,t){function n(e,t){return e===t||e!==e&&t!==t}e.exports=n},function(e,t,n){function r(e){return null==e?void 0===e?s:u:l&&l in Object(e)?a(e):i(e)}var o=n(151),a=n(358),i=n(359),u="[object Null]",s="[object Undefined]",l=o?o.toStringTag:void 0;e.exports=r},function(e,t,n){var r=n(85),o=r(Object,"create");e.exports=o},function(e,t,n){function r(e,t){var n=e.__data__;return o(t)?n["string"==typeof t?"string":"hash"]:n.map}var o=n(373);e.exports=r},function(e,t,n){"use strict";function r(e){return"Tab"===e.type.tabsRole}function o(e){return"TabPanel"===e.type.tabsRole}function a(e){return"TabList"===e.type.tabsRole}t.__esModule=!0,t.isTab=r,t.isTabPanel=o,t.isTabList=a},function(e,t,n){var r,o;/*!
  Copyright (c) 2016 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
!function(){"use strict";function n(){for(var e=[],t=0;t<arguments.length;t++){var r=arguments[t];if(r){var o=typeof r;if("string"===o||"number"===o)e.push(r);else if(Array.isArray(r))e.push(n.apply(null,r));else if("object"===o)for(var i in r)a.call(r,i)&&r[i]&&e.push(i)}}return e.join(" ")}var a={}.hasOwnProperty;void 0!==e&&e.exports?e.exports=n:(r=[],void 0!==(o=function(){return n}.apply(t,r))&&(e.exports=o))}()},function(e,t,n){"use strict";function r(){if(u)for(var e in s){var t=s[e],n=u.indexOf(e);if(n>-1||i("96",e),!l.plugins[n]){t.extractEvents||i("97",e),l.plugins[n]=t;var r=t.eventTypes;for(var a in r)o(r[a],t,a)||i("98",a,e)}}}function o(e,t,n){l.eventNameDispatchConfigs.hasOwnProperty(n)&&i("99",n),l.eventNameDispatchConfigs[n]=e;var r=e.phasedRegistrationNames;if(r){for(var o in r)if(r.hasOwnProperty(o)){var u=r[o];a(u,t,n)}return!0}return!!e.registrationName&&(a(e.registrationName,t,n),!0)}function a(e,t,n){l.registrationNameModules[e]&&i("100",e),l.registrationNameModules[e]=t,l.registrationNameDependencies[e]=t.eventTypes[n].dependencies}var i=n(3),u=(n(1),null),s={},l={plugins:[],eventNameDispatchConfigs:{},registrationNameModules:{},registrationNameDependencies:{},possibleRegistrationNames:null,injectEventPluginOrder:function(e){u&&i("101"),u=Array.prototype.slice.call(e),r()},injectEventPluginsByName:function(e){var t=!1;for(var n in e)if(e.hasOwnProperty(n)){var o=e[n];s.hasOwnProperty(n)&&s[n]===o||(s[n]&&i("102",n),s[n]=o,t=!0)}t&&r()},getPluginModuleForEvent:function(e){var t=e.dispatchConfig;if(t.registrationName)return l.registrationNameModules[t.registrationName]||null;if(void 0!==t.phasedRegistrationNames){var n=t.phasedRegistrationNames;for(var r in n)if(n.hasOwnProperty(r)){var o=l.registrationNameModules[n[r]];if(o)return o}}return null},_resetEventPlugins:function(){u=null;for(var e in s)s.hasOwnProperty(e)&&delete s[e];l.plugins.length=0;var t=l.eventNameDispatchConfigs;for(var n in t)t.hasOwnProperty(n)&&delete t[n];var r=l.registrationNameModules;for(var o in r)r.hasOwnProperty(o)&&delete r[o]}};e.exports=l},function(e,t,n){"use strict";function r(e){return"topMouseUp"===e||"topTouchEnd"===e||"topTouchCancel"===e}function o(e){return"topMouseMove"===e||"topTouchMove"===e}function a(e){return"topMouseDown"===e||"topTouchStart"===e}function i(e,t,n,r){var o=e.type||"unknown-event";e.currentTarget=m.getNodeFromInstance(r),t?y.invokeGuardedCallbackWithCatch(o,n,e):y.invokeGuardedCallback(o,n,e),e.currentTarget=null}function u(e,t){var n=e._dispatchListeners,r=e._dispatchInstances;if(Array.isArray(n))for(var o=0;o<n.length&&!e.isPropagationStopped();o++)i(e,t,n[o],r[o]);else n&&i(e,t,n,r);e._dispatchListeners=null,e._dispatchInstances=null}function s(e){var t=e._dispatchListeners,n=e._dispatchInstances;if(Array.isArray(t)){for(var r=0;r<t.length&&!e.isPropagationStopped();r++)if(t[r](e,n[r]))return n[r]}else if(t&&t(e,n))return n;return null}function l(e){var t=s(e);return e._dispatchInstances=null,e._dispatchListeners=null,t}function c(e){var t=e._dispatchListeners,n=e._dispatchInstances;Array.isArray(t)&&h("103"),e.currentTarget=t?m.getNodeFromInstance(n):null;var r=t?t(e):null;return e.currentTarget=null,e._dispatchListeners=null,e._dispatchInstances=null,r}function f(e){return!!e._dispatchListeners}var p,d,h=n(3),y=n(60),v=(n(1),n(2),{injectComponentTree:function(e){p=e},injectTreeTraversal:function(e){d=e}}),m={isEndish:r,isMoveish:o,isStartish:a,executeDirectDispatch:c,executeDispatchesInOrder:u,executeDispatchesInOrderStopAtTrue:l,hasDispatches:f,getInstanceFromNode:function(e){return p.getInstanceFromNode(e)},getNodeFromInstance:function(e){return p.getNodeFromInstance(e)},isAncestor:function(e,t){return d.isAncestor(e,t)},getLowestCommonAncestor:function(e,t){return d.getLowestCommonAncestor(e,t)},getParentInstance:function(e){return d.getParentInstance(e)},traverseTwoPhase:function(e,t,n){return d.traverseTwoPhase(e,t,n)},traverseEnterLeave:function(e,t,n,r,o){return d.traverseEnterLeave(e,t,n,r,o)},injection:v};e.exports=m},function(e,t,n){"use strict";function r(e,t,n){try{t(n)}catch(e){null===o&&(o=e)}}var o=null,a={invokeGuardedCallback:r,invokeGuardedCallbackWithCatch:r,rethrowCaughtError:function(){if(o){var e=o;throw o=null,e}}};e.exports=a},function(e,t,n){"use strict";function r(e){var t=e.target||e.srcElement||window;return t.correspondingUseElement&&(t=t.correspondingUseElement),3===t.nodeType?t.parentNode:t}e.exports=r},function(e,t,n){"use strict";/**
 * Checks if an event is supported in the current execution environment.
 *
 * NOTE: This will not work correctly for non-generic events such as `change`,
 * `reset`, `load`, `error`, and `select`.
 *
 * Borrows from Modernizr.
 *
 * @param {string} eventNameSuffix Event name, e.g. "click".
 * @param {?boolean} capture Check if the capture phase is supported.
 * @return {boolean} True if the event is supported.
 * @internal
 * @license Modernizr 3.0.0pre (Custom Build) | MIT
 */
function r(e,t){if(!a.canUseDOM||t&&!("addEventListener"in document))return!1;var n="on"+e,r=n in document;if(!r){var i=document.createElement("div");i.setAttribute(n,"return;"),r="function"==typeof i[n]}return!r&&o&&"wheel"===e&&(r=document.implementation.hasFeature("Events.wheel","3.0")),r}var o,a=n(9);a.canUseDOM&&(o=document.implementation&&document.implementation.hasFeature&&!0!==document.implementation.hasFeature("","")),e.exports=r},function(e,t,n){"use strict";function r(e){var t=this,n=t.nativeEvent;if(n.getModifierState)return n.getModifierState(e);var r=a[e];return!!r&&!!n[r]}function o(e){return r}var a={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};e.exports=o},function(e,t,n){"use strict";function r(e,t){return Array.isArray(t)&&(t=t[1]),t?t.nextSibling:e.firstChild}function o(e,t,n){c.insertTreeBefore(e,t,n)}function a(e,t,n){Array.isArray(t)?u(e,t[0],t[1],n):y(e,t,n)}function i(e,t){if(Array.isArray(t)){var n=t[1];t=t[0],s(e,t,n),e.removeChild(n)}e.removeChild(t)}function u(e,t,n,r){for(var o=t;;){var a=o.nextSibling;if(y(e,o,r),o===n)break;o=a}}function s(e,t,n){for(;;){var r=t.nextSibling;if(r===n)break;e.removeChild(r)}}function l(e,t,n){var r=e.parentNode,o=e.nextSibling;o===t?n&&y(r,document.createTextNode(n),o):n?(h(o,n),s(r,o,t)):s(r,e,t)}var c=n(28),f=n(198),p=(n(6),n(13),n(66)),d=n(44),h=n(107),y=p(function(e,t,n){e.insertBefore(t,n)}),v=f.dangerouslyReplaceNodeWithMarkup,m={dangerouslyReplaceNodeWithMarkup:v,replaceDelimitedText:l,processUpdates:function(e,t){for(var n=0;n<t.length;n++){var u=t[n];switch(u.type){case"INSERT_MARKUP":o(e,u.content,r(e,u.afterNode));break;case"MOVE_EXISTING":a(e,u.fromNode,r(e,u.afterNode));break;case"SET_MARKUP":d(e,u.content);break;case"TEXT_CONTENT":h(e,u.content);break;case"REMOVE_NODE":i(e,u.fromNode)}}}};e.exports=m},function(e,t,n){"use strict";var r={html:"http://www.w3.org/1999/xhtml",mathml:"http://www.w3.org/1998/Math/MathML",svg:"http://www.w3.org/2000/svg"};e.exports=r},function(e,t,n){"use strict";var r=function(e){return"undefined"!=typeof MSApp&&MSApp.execUnsafeLocalFunction?function(t,n,r,o){MSApp.execUnsafeLocalFunction(function(){return e(t,n,r,o)})}:e};e.exports=r},function(e,t,n){"use strict";function r(e){null!=e.checkedLink&&null!=e.valueLink&&u("87")}function o(e){r(e),(null!=e.value||null!=e.onChange)&&u("88")}function a(e){r(e),(null!=e.checked||null!=e.onChange)&&u("89")}function i(e){if(e){var t=e.getName();if(t)return" Check the render method of `"+t+"`."}return""}var u=n(3),s=n(216),l=n(95),c=n(24),f=l(c.isValidElement),p=(n(1),n(2),{button:!0,checkbox:!0,image:!0,hidden:!0,radio:!0,reset:!0,submit:!0}),d={value:function(e,t,n){return!e[t]||p[e.type]||e.onChange||e.readOnly||e.disabled?null:new Error("You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`.")},checked:function(e,t,n){return!e[t]||e.onChange||e.readOnly||e.disabled?null:new Error("You provided a `checked` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultChecked`. Otherwise, set either `onChange` or `readOnly`.")},onChange:f.func},h={},y={checkPropTypes:function(e,t,n){for(var r in d){if(d.hasOwnProperty(r))var o=d[r](t,r,e,"prop",null,s);if(o instanceof Error&&!(o.message in h)){h[o.message]=!0;i(n)}}},getValue:function(e){return e.valueLink?(o(e),e.valueLink.value):e.value},getChecked:function(e){return e.checkedLink?(a(e),e.checkedLink.value):e.checked},executeOnChange:function(e,t){return e.valueLink?(o(e),e.valueLink.requestChange(t.target.value)):e.checkedLink?(a(e),e.checkedLink.requestChange(t.target.checked)):e.onChange?e.onChange.call(void 0,t):void 0}};e.exports=y},function(e,t,n){"use strict";var r=n(3),o=(n(1),!1),a={replaceNodeWithMarkup:null,processChildrenUpdates:null,injection:{injectEnvironment:function(e){o&&r("104"),a.replaceNodeWithMarkup=e.replaceNodeWithMarkup,a.processChildrenUpdates=e.processChildrenUpdates,o=!0}}};e.exports=a},function(e,t,n){"use strict";function r(e,t){return e===t?0!==e||0!==t||1/e==1/t:e!==e&&t!==t}function o(e,t){if(r(e,t))return!0;if("object"!=typeof e||null===e||"object"!=typeof t||null===t)return!1;var n=Object.keys(e),o=Object.keys(t);if(n.length!==o.length)return!1;for(var i=0;i<n.length;i++)if(!a.call(t,n[i])||!r(e[n[i]],t[n[i]]))return!1;return!0}var a=Object.prototype.hasOwnProperty;e.exports=o},function(e,t,n){"use strict";function r(e,t){var n=null===e||!1===e,r=null===t||!1===t;if(n||r)return n===r;var o=typeof e,a=typeof t;return"string"===o||"number"===o?"string"===a||"number"===a:"object"===a&&e.type===t.type&&e.key===t.key}e.exports=r},function(e,t,n){"use strict";function r(e){var t={"=":"=0",":":"=2"};return"$"+(""+e).replace(/[=:]/g,function(e){return t[e]})}function o(e){var t=/(=0|=2)/g,n={"=0":"=","=2":":"};return(""+("."===e[0]&&"$"===e[1]?e.substring(2):e.substring(1))).replace(t,function(e){return n[e]})}var a={escape:r,unescape:o};e.exports=a},function(e,t,n){"use strict";function r(e){s.enqueueUpdate(e)}function o(e){var t=typeof e;if("object"!==t)return t;var n=e.constructor&&e.constructor.name||t,r=Object.keys(e);return r.length>0&&r.length<20?n+" (keys: "+r.join(", ")+")":n}function a(e,t){var n=u.get(e);if(!n){return null}return n}var i=n(3),u=(n(17),n(35)),s=(n(13),n(14)),l=(n(1),n(2),{isMounted:function(e){var t=u.get(e);return!!t&&!!t._renderedComponent},enqueueCallback:function(e,t,n){l.validateCallback(t,n);var o=a(e);if(!o)return null;o._pendingCallbacks?o._pendingCallbacks.push(t):o._pendingCallbacks=[t],r(o)},enqueueCallbackInternal:function(e,t){e._pendingCallbacks?e._pendingCallbacks.push(t):e._pendingCallbacks=[t],r(e)},enqueueForceUpdate:function(e){var t=a(e,"forceUpdate");t&&(t._pendingForceUpdate=!0,r(t))},enqueueReplaceState:function(e,t,n){var o=a(e,"replaceState");o&&(o._pendingStateQueue=[t],o._pendingReplaceState=!0,void 0!==n&&null!==n&&(l.validateCallback(n,"replaceState"),o._pendingCallbacks?o._pendingCallbacks.push(n):o._pendingCallbacks=[n]),r(o))},enqueueSetState:function(e,t){var n=a(e,"setState");if(n){(n._pendingStateQueue||(n._pendingStateQueue=[])).push(t),r(n)}},enqueueElementInternal:function(e,t,n){e._pendingElement=t,e._context=n,r(e)},validateCallback:function(e,t){e&&"function"!=typeof e&&i("122",t,o(e))}});e.exports=l},function(e,t,n){"use strict";var r=(n(4),n(11)),o=(n(2),r);e.exports=o},function(e,t,n){"use strict";function r(e){var t,n=e.keyCode;return"charCode"in e?0===(t=e.charCode)&&13===n&&(t=13):t=n,t>=32||13===t?t:0}e.exports=r},function(e,t,n){"use strict";function r(e){"undefined"!=typeof console&&"function"==typeof console.error&&console.error(e);try{throw new Error(e)}catch(e){}}t.a=r},function(e,t,n){"use strict";function r(e){if(!Object(i.a)(e)||Object(o.a)(e)!=u)return!1;var t=Object(a.a)(e);if(null===t)return!0;var n=f.call(t,"constructor")&&t.constructor;return"function"==typeof n&&n instanceof n&&c.call(n)==p}var o=n(267),a=n(272),i=n(274),u="[object Object]",s=Function.prototype,l=Object.prototype,c=s.toString,f=l.hasOwnProperty,p=c.call(Object);t.a=r},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0,t.locationsAreEqual=t.createLocation=void 0;var o=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},a=n(133),i=r(a),u=n(134),s=r(u),l=n(38);t.createLocation=function(e,t,n,r){var a=void 0;"string"==typeof e?(a=(0,l.parsePath)(e),a.state=t):(a=o({},e),void 0===a.pathname&&(a.pathname=""),a.search?"?"!==a.search.charAt(0)&&(a.search="?"+a.search):a.search="",a.hash?"#"!==a.hash.charAt(0)&&(a.hash="#"+a.hash):a.hash="",void 0!==t&&void 0===a.state&&(a.state=t));try{a.pathname=decodeURI(a.pathname)}catch(e){throw e instanceof URIError?new URIError('Pathname "'+a.pathname+'" could not be decoded. This is likely caused by an invalid percent-encoding.'):e}return n&&(a.key=n),r?a.pathname?"/"!==a.pathname.charAt(0)&&(a.pathname=(0,i.default)(a.pathname,r.pathname)):a.pathname=r.pathname:a.pathname||(a.pathname="/"),a},t.locationsAreEqual=function(e,t){return e.pathname===t.pathname&&e.search===t.search&&e.hash===t.hash&&e.key===t.key&&(0,s.default)(e.state,t.state)}},function(e,t,n){"use strict";t.__esModule=!0;var r=n(7),o=function(e){return e&&e.__esModule?e:{default:e}}(r),a=function(){var e=null,t=function(t){return(0,o.default)(null==e,"A history supports only one prompt at a time"),e=t,function(){e===t&&(e=null)}},n=function(t,n,r,a){if(null!=e){var i="function"==typeof e?e(t,n):e;"string"==typeof i?"function"==typeof r?r(i,a):((0,o.default)(!1,"A history needs a getUserConfirmation function in order to use a prompt message"),a(!0)):a(!1!==i)}else a(!0)},r=[];return{setPrompt:t,confirmTransitionTo:n,appendListener:function(e){var t=!0,n=function(){t&&e.apply(void 0,arguments)};return r.push(n),function(){t=!1,r=r.filter(function(e){return e!==n})}},notifyListeners:function(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];r.forEach(function(e){return e.apply(void 0,t)})}}};t.default=a},function(e,t,n){"use strict";var r=n(80);t.a=r.a},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var i=n(7),u=n.n(i),s=n(12),l=n.n(s),c=n(0),f=n.n(c),p=n(5),d=n.n(p),h=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},y=function(e){function t(){var n,a,i;r(this,t);for(var u=arguments.length,s=Array(u),l=0;l<u;l++)s[l]=arguments[l];return n=a=o(this,e.call.apply(e,[this].concat(s))),a.state={match:a.computeMatch(a.props.history.location.pathname)},i=n,o(a,i)}return a(t,e),t.prototype.getChildContext=function(){return{router:h({},this.context.router,{history:this.props.history,route:{location:this.props.history.location,match:this.state.match}})}},t.prototype.computeMatch=function(e){return{path:"/",url:"/",params:{},isExact:"/"===e}},t.prototype.componentWillMount=function(){var e=this,t=this.props,n=t.children,r=t.history;l()(null==n||1===f.a.Children.count(n),"A <Router> may have only one child element"),this.unlisten=r.listen(function(){e.setState({match:e.computeMatch(r.location.pathname)})})},t.prototype.componentWillReceiveProps=function(e){u()(this.props.history===e.history,"You cannot change <Router history>")},t.prototype.componentWillUnmount=function(){this.unlisten()},t.prototype.render=function(){var e=this.props.children;return e?f.a.Children.only(e):null},t}(f.a.Component);y.propTypes={history:d.a.object.isRequired,children:d.a.node},y.contextTypes={router:d.a.object},y.childContextTypes={router:d.a.object.isRequired},t.a=y},function(e,t,n){"use strict";var r=n(293),o=n.n(r),a={},i=0,u=function(e,t){var n=""+t.end+t.strict+t.sensitive,r=a[n]||(a[n]={});if(r[e])return r[e];var u=[],s=o()(e,u,t),l={re:s,keys:u};return i<1e4&&(r[e]=l,i++),l},s=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};"string"==typeof t&&(t={path:t});var n=t,r=n.path,o=void 0===r?"/":r,a=n.exact,i=void 0!==a&&a,s=n.strict,l=void 0!==s&&s,c=n.sensitive,f=void 0!==c&&c,p=u(o,{end:i,strict:l,sensitive:f}),d=p.re,h=p.keys,y=d.exec(e);if(!y)return null;var v=y[0],m=y.slice(1),g=e===v;return i&&!g?null:{path:o,url:"/"===o&&""===v?"/":v,isExact:g,params:h.reduce(function(e,t,n){return e[t.name]=m[n],e},{})}};t.a=s},function(e,t,n){"use strict";var r=n(7),o=n.n(r),a=function(){var e=null,t=function(t){return o()(null==e,"A history supports only one prompt at a time"),e=t,function(){e===t&&(e=null)}},n=function(t,n,r,a){if(null!=e){var i="function"==typeof e?e(t,n):e;"string"==typeof i?"function"==typeof r?r(i,a):(o()(!1,"A history needs a getUserConfirmation function in order to use a prompt message"),a(!0)):a(!1!==i)}else a(!0)},r=[];return{setPrompt:t,confirmTransitionTo:n,appendListener:function(e){var t=!0,n=function(){t&&e.apply(void 0,arguments)};return r.push(n),function(){t=!1,r=r.filter(function(e){return e!==n})}},notifyListeners:function(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];r.forEach(function(e){return e.apply(void 0,t)})}}};t.a=a},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(328),o=function(e){return e&&e.__esModule?e:{default:e}}(r);t.default=o.default,e.exports=t.default},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.formPLaylistModal={overlay:{backgroundColor:"rgba(0, 0, 0, 0.75)"},content:{top:"50%",left:"50%",right:"auto",bottom:"auto",marginRight:"-50%",transform:"translate(-50%, -50%)",background:"rgba(0, 0, 0, 0.75)",width:"100%",height:"70%",display:"flex",flexDirection:"column",border:"1px solid #1db954"}}},function(e,t,n){function r(e,t){var n=a(e,t);return o(n)?n:void 0}var o=n(357),a=n(363);e.exports=r},function(e,t,n){function r(e){if(!a(e))return!1;var t=o(e);return t==u||t==s||t==i||t==l}var o=n(53),a=n(23),i="[object AsyncFunction]",u="[object Function]",s="[object GeneratorFunction]",l="[object Proxy]";e.exports=r},function(e,t,n){function r(e,t,n){"__proto__"==t&&o?o(e,t,{configurable:!0,enumerable:!0,value:n,writable:!0}):e[t]=n}var o=n(154);e.exports=r},function(e,t,n){function r(e){return null!=e&&a(e.length)&&!o(e)}var o=n(86),a=n(159);e.exports=r},function(e,t,n){"use strict";function r(e){return(0,l.isTab)(e)||(0,l.isTabList)(e)||(0,l.isTabPanel)(e)}function o(e,t){return s.Children.map(e,function(e){return null===e?null:r(e)?t(e):e.props&&e.props.children&&"object"===u(e.props.children)?(0,s.cloneElement)(e,i({},e.props,{children:o(e.props.children,t)})):e})}function a(e,t){return s.Children.forEach(e,function(e){null!==e&&((0,l.isTab)(e)||(0,l.isTabPanel)(e)?t(e):e.props&&e.props.children&&"object"===u(e.props.children)&&((0,l.isTabList)(e)&&t(e),a(e.props.children,t)))})}t.__esModule=!0;var i=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},u="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};t.deepMap=o,t.deepForEach=a;var s=n(0),l=n(56)},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.DEPRECATED_CONFIG_PROPS=t.defaultProps=t.propTypes=void 0;var r=n(5),o=function(e){return e&&e.__esModule?e:{default:e}}(r),a=o.default.string,i=o.default.bool,u=o.default.number,s=o.default.array,l=o.default.oneOfType,c=o.default.shape,f=o.default.object,p=o.default.func;t.propTypes={url:l([a,s]),playing:i,loop:i,controls:i,volume:u,muted:i,playbackRate:u,width:l([a,u]),height:l([a,u]),style:f,progressFrequency:u,playsinline:i,config:c({soundcloud:c({options:f}),youtube:c({playerVars:f,preload:i}),facebook:c({appId:a}),dailymotion:c({params:f,preload:i}),vimeo:c({iframeParams:f,preload:i}),vidme:c({format:a}),file:c({attributes:f,tracks:s,forceAudio:i,forceHLS:i,forceDASH:i}),wistia:c({options:f})}),onReady:p,onStart:p,onPlay:p,onPause:p,onBuffer:p,onEnded:p,onError:p,onDuration:p,onSeek:p,onProgress:p},t.defaultProps={playing:!1,loop:!1,controls:!1,volume:.8,muted:!1,playbackRate:1,width:640,height:360,style:{},progressFrequency:1e3,playsinline:!1,config:{soundcloud:{options:{visual:!0,buying:!1,liking:!1,download:!1,sharing:!1,show_comments:!1,show_playcount:!1}},youtube:{playerVars:{autoplay:0,playsinline:1,showinfo:0,rel:0,iv_load_policy:3},preload:!1},facebook:{appId:"1309697205772819"},dailymotion:{params:{api:1,"endscreen-enable":!1},preload:!1},vimeo:{playerOptions:{autopause:!1,autoplay:!1,byline:!1,portrait:!1,title:!1},preload:!1},vidme:{format:null},file:{attributes:{},tracks:[],forceAudio:!1,forceHLS:!1,forceDASH:!1},wistia:{options:{}}},onReady:function(){},onStart:function(){},onPlay:function(){},onPause:function(){},onBuffer:function(){},onEnded:function(){},onError:function(){},onDuration:function(){},onSeek:function(){},onProgress:function(){}},t.DEPRECATED_CONFIG_PROPS=["soundcloudConfig","youtubeConfig","facebookConfig","dailymotionConfig","vimeoConfig","vidmeConfig","fileConfig","wistiaConfig"]},function(e,t,n){"use strict";function r(e,t,n){this.props=e,this.context=t,this.refs=l,this.updater=n||s}function o(e,t,n){this.props=e,this.context=t,this.refs=l,this.updater=n||s}function a(){}var i=n(31),u=n(4),s=n(92),l=(n(93),n(41));n(1),n(170);r.prototype.isReactComponent={},r.prototype.setState=function(e,t){"object"!=typeof e&&"function"!=typeof e&&null!=e&&i("85"),this.updater.enqueueSetState(this,e),t&&this.updater.enqueueCallback(this,t,"setState")},r.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this),e&&this.updater.enqueueCallback(this,e,"forceUpdate")};a.prototype=r.prototype,o.prototype=new a,o.prototype.constructor=o,u(o.prototype,r.prototype),o.prototype.isPureReactComponent=!0,e.exports={Component:r,PureComponent:o}},function(e,t,n){"use strict";var r=(n(2),{isMounted:function(e){return!1},enqueueCallback:function(e,t){},enqueueForceUpdate:function(e){},enqueueReplaceState:function(e,t){},enqueueSetState:function(e,t){}});e.exports=r},function(e,t,n){"use strict";var r=!1;e.exports=r},function(e,t,n){"use strict";var r="function"==typeof Symbol&&Symbol.for&&Symbol.for("react.element")||60103;e.exports=r},function(e,t,n){"use strict";var r=n(178);e.exports=function(e){return r(e,!1)}},function(e,t,n){"use strict";e.exports="SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED"},function(e,t,n){"use strict";e.exports=n(184)},function(e,t,n){"use strict";var r={hasCachedChildNodes:1};e.exports=r},function(e,t,n){"use strict";function r(e,t){return null==t&&o("30"),null==e?t:Array.isArray(e)?Array.isArray(t)?(e.push.apply(e,t),e):(e.push(t),e):Array.isArray(t)?[e].concat(t):[e,t]}var o=n(3);n(1);e.exports=r},function(e,t,n){"use strict";function r(e,t,n){Array.isArray(e)?e.forEach(t,n):e&&t.call(n,e)}e.exports=r},function(e,t,n){"use strict";function r(){return!a&&o.canUseDOM&&(a="textContent"in document.documentElement?"textContent":"innerText"),a}var o=n(9),a=null;e.exports=r},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var o=n(3),a=n(22),i=(n(1),function(){function e(t){r(this,e),this._callbacks=null,this._contexts=null,this._arg=t}return e.prototype.enqueue=function(e,t){this._callbacks=this._callbacks||[],this._callbacks.push(e),this._contexts=this._contexts||[],this._contexts.push(t)},e.prototype.notifyAll=function(){var e=this._callbacks,t=this._contexts,n=this._arg;if(e&&t){e.length!==t.length&&o("24"),this._callbacks=null,this._contexts=null;for(var r=0;r<e.length;r++)e[r].call(t[r],n);e.length=0,t.length=0}},e.prototype.checkpoint=function(){return this._callbacks?this._callbacks.length:0},e.prototype.rollback=function(e){this._callbacks&&this._contexts&&(this._callbacks.length=e,this._contexts.length=e)},e.prototype.reset=function(){this._callbacks=null,this._contexts=null},e.prototype.destructor=function(){this.reset()},e}());e.exports=a.addPoolingTo(i)},function(e,t,n){"use strict";var r={logTopLevelRenders:!1};e.exports=r},function(e,t,n){"use strict";function r(e){var t=e.type,n=e.nodeName;return n&&"input"===n.toLowerCase()&&("checkbox"===t||"radio"===t)}function o(e){return e._wrapperState.valueTracker}function a(e,t){e._wrapperState.valueTracker=t}function i(e){delete e._wrapperState.valueTracker}function u(e){var t;return e&&(t=r(e)?""+e.checked:e.value),t}var s=n(6),l={_getTrackerFromNode:function(e){return o(s.getInstanceFromNode(e))},track:function(e){if(!o(e)){var t=s.getNodeFromInstance(e),n=r(t)?"checked":"value",u=Object.getOwnPropertyDescriptor(t.constructor.prototype,n),l=""+t[n];t.hasOwnProperty(n)||"function"!=typeof u.get||"function"!=typeof u.set||(Object.defineProperty(t,n,{enumerable:u.enumerable,configurable:!0,get:function(){return u.get.call(this)},set:function(e){l=""+e,u.set.call(this,e)}}),a(e,{getValue:function(){return l},setValue:function(e){l=""+e},stopTracking:function(){i(e),delete t[n]}}))}},updateValueIfChanged:function(e){if(!e)return!1;var t=o(e);if(!t)return l.track(e),!0;var n=t.getValue(),r=u(s.getNodeFromInstance(e));return r!==n&&(t.setValue(r),!0)},stopTracking:function(e){var t=o(e);t&&t.stopTracking()}};e.exports=l},function(e,t,n){"use strict";function r(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return"input"===t?!!o[e.type]:"textarea"===t}var o={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};e.exports=r},function(e,t,n){"use strict";var r={currentScrollLeft:0,currentScrollTop:0,refreshScrollValues:function(e){r.currentScrollLeft=e.x,r.currentScrollTop=e.y}};e.exports=r},function(e,t,n){"use strict";var r=n(9),o=n(45),a=n(44),i=function(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&3===n.nodeType)return void(n.nodeValue=t)}e.textContent=t};r.canUseDOM&&("textContent"in document.documentElement||(i=function(e,t){if(3===e.nodeType)return void(e.nodeValue=t);a(e,o(t))})),e.exports=i},function(e,t,n){"use strict";function r(e){try{e.focus()}catch(e){}}e.exports=r},function(e,t,n){"use strict";function r(e,t){return e+t.charAt(0).toUpperCase()+t.substring(1)}var o={animationIterationCount:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},a=["Webkit","ms","Moz","O"];Object.keys(o).forEach(function(e){a.forEach(function(t){o[r(t,e)]=o[e]})});var i={background:{backgroundAttachment:!0,backgroundColor:!0,backgroundImage:!0,backgroundPositionX:!0,backgroundPositionY:!0,backgroundRepeat:!0},backgroundPosition:{backgroundPositionX:!0,backgroundPositionY:!0},border:{borderWidth:!0,borderStyle:!0,borderColor:!0},borderBottom:{borderBottomWidth:!0,borderBottomStyle:!0,borderBottomColor:!0},borderLeft:{borderLeftWidth:!0,borderLeftStyle:!0,borderLeftColor:!0},borderRight:{borderRightWidth:!0,borderRightStyle:!0,borderRightColor:!0},borderTop:{borderTopWidth:!0,borderTopStyle:!0,borderTopColor:!0},font:{fontStyle:!0,fontVariant:!0,fontWeight:!0,fontSize:!0,lineHeight:!0,fontFamily:!0},outline:{outlineWidth:!0,outlineStyle:!0,outlineColor:!0}},u={isUnitlessNumber:o,shorthandPropertyExpansions:i};e.exports=u},function(e,t,n){"use strict";function r(e){return!!l.hasOwnProperty(e)||!s.hasOwnProperty(e)&&(u.test(e)?(l[e]=!0,!0):(s[e]=!0,!1))}function o(e,t){return null==t||e.hasBooleanValue&&!t||e.hasNumericValue&&isNaN(t)||e.hasPositiveNumericValue&&t<1||e.hasOverloadedBooleanValue&&!1===t}var a=n(26),i=(n(6),n(13),n(212)),u=(n(2),new RegExp("^["+a.ATTRIBUTE_NAME_START_CHAR+"]["+a.ATTRIBUTE_NAME_CHAR+"]*$")),s={},l={},c={createMarkupForID:function(e){return a.ID_ATTRIBUTE_NAME+"="+i(e)},setAttributeForID:function(e,t){e.setAttribute(a.ID_ATTRIBUTE_NAME,t)},createMarkupForRoot:function(){return a.ROOT_ATTRIBUTE_NAME+'=""'},setAttributeForRoot:function(e){e.setAttribute(a.ROOT_ATTRIBUTE_NAME,"")},createMarkupForProperty:function(e,t){var n=a.properties.hasOwnProperty(e)?a.properties[e]:null;if(n){if(o(n,t))return"";var r=n.attributeName;return n.hasBooleanValue||n.hasOverloadedBooleanValue&&!0===t?r+'=""':r+"="+i(t)}return a.isCustomAttribute(e)?null==t?"":e+"="+i(t):null},createMarkupForCustomAttribute:function(e,t){return r(e)&&null!=t?e+"="+i(t):""},setValueForProperty:function(e,t,n){var r=a.properties.hasOwnProperty(t)?a.properties[t]:null;if(r){var i=r.mutationMethod;if(i)i(e,n);else{if(o(r,n))return void this.deleteValueForProperty(e,t);if(r.mustUseProperty)e[r.propertyName]=n;else{var u=r.attributeName,s=r.attributeNamespace;s?e.setAttributeNS(s,u,""+n):r.hasBooleanValue||r.hasOverloadedBooleanValue&&!0===n?e.setAttribute(u,""):e.setAttribute(u,""+n)}}}else if(a.isCustomAttribute(t))return void c.setValueForAttribute(e,t,n)},setValueForAttribute:function(e,t,n){if(r(t)){null==n?e.removeAttribute(t):e.setAttribute(t,""+n)}},deleteValueForAttribute:function(e,t){e.removeAttribute(t)},deleteValueForProperty:function(e,t){var n=a.properties.hasOwnProperty(t)?a.properties[t]:null;if(n){var r=n.mutationMethod;if(r)r(e,void 0);else if(n.mustUseProperty){var o=n.propertyName;n.hasBooleanValue?e[o]=!1:e[o]=""}else e.removeAttribute(n.attributeName)}else a.isCustomAttribute(t)&&e.removeAttribute(t)}};e.exports=c},function(e,t,n){"use strict";function r(){if(this._rootNodeID&&this._wrapperState.pendingUpdate){this._wrapperState.pendingUpdate=!1;var e=this._currentElement.props,t=u.getValue(e);null!=t&&o(this,Boolean(e.multiple),t)}}function o(e,t,n){var r,o,a=s.getNodeFromInstance(e).options;if(t){for(r={},o=0;o<n.length;o++)r[""+n[o]]=!0;for(o=0;o<a.length;o++){var i=r.hasOwnProperty(a[o].value);a[o].selected!==i&&(a[o].selected=i)}}else{for(r=""+n,o=0;o<a.length;o++)if(a[o].value===r)return void(a[o].selected=!0);a.length&&(a[0].selected=!0)}}function a(e){var t=this._currentElement.props,n=u.executeOnChange(t,e);return this._rootNodeID&&(this._wrapperState.pendingUpdate=!0),l.asap(r,this),n}var i=n(4),u=n(67),s=n(6),l=n(14),c=(n(2),!1),f={getHostProps:function(e,t){return i({},t,{onChange:e._wrapperState.onChange,value:void 0})},mountWrapper:function(e,t){var n=u.getValue(t);e._wrapperState={pendingUpdate:!1,initialValue:null!=n?n:t.defaultValue,listeners:null,onChange:a.bind(e),wasMultiple:Boolean(t.multiple)},void 0===t.value||void 0===t.defaultValue||c||(c=!0)},getSelectValueContext:function(e){return e._wrapperState.initialValue},postUpdateWrapper:function(e){var t=e._currentElement.props;e._wrapperState.initialValue=void 0;var n=e._wrapperState.wasMultiple;e._wrapperState.wasMultiple=Boolean(t.multiple);var r=u.getValue(t);null!=r?(e._wrapperState.pendingUpdate=!1,o(e,Boolean(t.multiple),r)):n!==Boolean(t.multiple)&&(null!=t.defaultValue?o(e,Boolean(t.multiple),t.defaultValue):o(e,Boolean(t.multiple),t.multiple?[]:""))}};e.exports=f},function(e,t){function n(){throw new Error("setTimeout has not been defined")}function r(){throw new Error("clearTimeout has not been defined")}function o(e){if(c===setTimeout)return setTimeout(e,0);if((c===n||!c)&&setTimeout)return c=setTimeout,setTimeout(e,0);try{return c(e,0)}catch(t){try{return c.call(null,e,0)}catch(t){return c.call(this,e,0)}}}function a(e){if(f===clearTimeout)return clearTimeout(e);if((f===r||!f)&&clearTimeout)return f=clearTimeout,clearTimeout(e);try{return f(e)}catch(t){try{return f.call(null,e)}catch(t){return f.call(this,e)}}}function i(){y&&d&&(y=!1,d.length?h=d.concat(h):v=-1,h.length&&u())}function u(){if(!y){var e=o(i);y=!0;for(var t=h.length;t;){for(d=h,h=[];++v<t;)d&&d[v].run();v=-1,t=h.length}d=null,y=!1,a(e)}}function s(e,t){this.fun=e,this.array=t}function l(){}var c,f,p=e.exports={};!function(){try{c="function"==typeof setTimeout?setTimeout:n}catch(e){c=n}try{f="function"==typeof clearTimeout?clearTimeout:r}catch(e){f=r}}();var d,h=[],y=!1,v=-1;p.nextTick=function(e){var t=new Array(arguments.length-1);if(arguments.length>1)for(var n=1;n<arguments.length;n++)t[n-1]=arguments[n];h.push(new s(e,t)),1!==h.length||y||o(u)},s.prototype.run=function(){this.fun.apply(null,this.array)},p.title="browser",p.browser=!0,p.env={},p.argv=[],p.version="",p.versions={},p.on=l,p.addListener=l,p.once=l,p.off=l,p.removeListener=l,p.removeAllListeners=l,p.emit=l,p.prependListener=l,p.prependOnceListener=l,p.listeners=function(e){return[]},p.binding=function(e){throw new Error("process.binding is not supported")},p.cwd=function(){return"/"},p.chdir=function(e){throw new Error("process.chdir is not supported")},p.umask=function(){return 0}},function(e,t,n){"use strict";function r(e){if(e){var t=e.getName();if(t)return" Check the render method of `"+t+"`."}return""}function o(e){return"function"==typeof e&&void 0!==e.prototype&&"function"==typeof e.prototype.mountComponent&&"function"==typeof e.prototype.receiveComponent}function a(e,t){var n;if(null===e||!1===e)n=l.create(a);else if("object"==typeof e){var u=e,s=u.type;if("function"!=typeof s&&"string"!=typeof s){var p="";p+=r(u._owner),i("130",null==s?s:typeof s,p)}"string"==typeof u.type?n=c.createInternalComponent(u):o(u.type)?(n=new u.type(u),n.getHostNode||(n.getHostNode=n.getNativeNode)):n=new f(u)}else"string"==typeof e||"number"==typeof e?n=c.createInstanceForText(e):i("131",typeof e);return n._mountIndex=0,n._mountImage=null,n}var i=n(3),u=n(4),s=n(221),l=n(115),c=n(116),f=(n(222),n(1),n(2),function(e){this.construct(e)});u(f.prototype,s,{_instantiateReactComponent:a}),e.exports=a},function(e,t,n){"use strict";var r=n(3),o=n(24),a=(n(1),{HOST:0,COMPOSITE:1,EMPTY:2,getType:function(e){return null===e||!1===e?a.EMPTY:o.isValidElement(e)?"function"==typeof e.type?a.COMPOSITE:a.HOST:void r("26",e)}});e.exports=a},function(e,t,n){"use strict";var r,o={injectEmptyComponentFactory:function(e){r=e}},a={create:function(e){return r(e)}};a.injection=o,e.exports=a},function(e,t,n){"use strict";function r(e){return u||i("111",e.type),new u(e)}function o(e){return new s(e)}function a(e){return e instanceof s}var i=n(3),u=(n(1),null),s=null,l={injectGenericComponentClass:function(e){u=e},injectTextComponentClass:function(e){s=e}},c={createInternalComponent:r,createInstanceForText:o,isTextComponent:a,injection:l};e.exports=c},function(e,t,n){"use strict";function r(e,t){return e&&"object"==typeof e&&null!=e.key?l.escape(e.key):t.toString(36)}function o(e,t,n,a){var p=typeof e;if("undefined"!==p&&"boolean"!==p||(e=null),null===e||"string"===p||"number"===p||"object"===p&&e.$$typeof===u)return n(a,e,""===t?c+r(e,0):t),1;var d,h,y=0,v=""===t?c:t+f;if(Array.isArray(e))for(var m=0;m<e.length;m++)d=e[m],h=v+r(d,m),y+=o(d,h,n,a);else{var g=s(e);if(g){var b,_=g.call(e);if(g!==e.entries)for(var w=0;!(b=_.next()).done;)d=b.value,h=v+r(d,w++),y+=o(d,h,n,a);else for(;!(b=_.next()).done;){var E=b.value;E&&(d=E[1],h=v+l.escape(E[0])+f+r(d,0),y+=o(d,h,n,a))}}else if("object"===p){var O="",P=String(e);i("31","[object Object]"===P?"object with keys {"+Object.keys(e).join(", ")+"}":P,O)}}return y}function a(e,t,n){return null==e?0:o(e,"",t,n)}var i=n(3),u=(n(17),n(223)),s=n(224),l=(n(1),n(71)),c=(n(2),"."),f=":";e.exports=a},function(e,t,n){"use strict";function r(e){var t=Function.prototype.toString,n=Object.prototype.hasOwnProperty,r=RegExp("^"+t.call(n).replace(/[\\^$.*+?()[\]{}|]/g,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$");try{var o=t.call(e);return r.test(o)}catch(e){return!1}}function o(e){var t=l(e);if(t){var n=t.childIDs;c(e),n.forEach(o)}}function a(e,t,n){return"\n    in "+(e||"Unknown")+(t?" (at "+t.fileName.replace(/^.*[\\\/]/,"")+":"+t.lineNumber+")":n?" (created by "+n+")":"")}function i(e){return null==e?"#empty":"string"==typeof e||"number"==typeof e?"#text":"string"==typeof e.type?e.type:e.type.displayName||e.type.name||"Unknown"}function u(e){var t,n=C.getDisplayName(e),r=C.getElement(e),o=C.getOwnerID(e);return o&&(t=C.getDisplayName(o)),a(n,r&&r._source,t)}var s,l,c,f,p,d,h,y=n(31),v=n(17),m=(n(1),n(2),"function"==typeof Array.from&&"function"==typeof Map&&r(Map)&&null!=Map.prototype&&"function"==typeof Map.prototype.keys&&r(Map.prototype.keys)&&"function"==typeof Set&&r(Set)&&null!=Set.prototype&&"function"==typeof Set.prototype.keys&&r(Set.prototype.keys));if(m){var g=new Map,b=new Set;s=function(e,t){g.set(e,t)},l=function(e){return g.get(e)},c=function(e){g.delete(e)},f=function(){return Array.from(g.keys())},p=function(e){b.add(e)},d=function(e){b.delete(e)},h=function(){return Array.from(b.keys())}}else{var _={},w={},E=function(e){return"."+e},O=function(e){return parseInt(e.substr(1),10)};s=function(e,t){var n=E(e);_[n]=t},l=function(e){var t=E(e);return _[t]},c=function(e){var t=E(e);delete _[t]},f=function(){return Object.keys(_).map(O)},p=function(e){var t=E(e);w[t]=!0},d=function(e){var t=E(e);delete w[t]},h=function(){return Object.keys(w).map(O)}}var P=[],C={onSetChildren:function(e,t){var n=l(e);n||y("144"),n.childIDs=t;for(var r=0;r<t.length;r++){var o=t[r],a=l(o);a||y("140"),null==a.childIDs&&"object"==typeof a.element&&null!=a.element&&y("141"),a.isMounted||y("71"),null==a.parentID&&(a.parentID=e),a.parentID!==e&&y("142",o,a.parentID,e)}},onBeforeMountComponent:function(e,t,n){s(e,{element:t,parentID:n,text:null,childIDs:[],isMounted:!1,updateCount:0})},onBeforeUpdateComponent:function(e,t){var n=l(e);n&&n.isMounted&&(n.element=t)},onMountComponent:function(e){var t=l(e);t||y("144"),t.isMounted=!0,0===t.parentID&&p(e)},onUpdateComponent:function(e){var t=l(e);t&&t.isMounted&&t.updateCount++},onUnmountComponent:function(e){var t=l(e);if(t){t.isMounted=!1;0===t.parentID&&d(e)}P.push(e)},purgeUnmountedComponents:function(){if(!C._preventPurging){for(var e=0;e<P.length;e++){o(P[e])}P.length=0}},isMounted:function(e){var t=l(e);return!!t&&t.isMounted},getCurrentStackAddendum:function(e){var t="";if(e){var n=i(e),r=e._owner;t+=a(n,e._source,r&&r.getName())}var o=v.current,u=o&&o._debugID;return t+=C.getStackAddendumByID(u)},getStackAddendumByID:function(e){for(var t="";e;)t+=u(e),e=C.getParentID(e);return t},getChildIDs:function(e){var t=l(e);return t?t.childIDs:[]},getDisplayName:function(e){var t=C.getElement(e);return t?i(t):null},getElement:function(e){var t=l(e);return t?t.element:null},getOwnerID:function(e){var t=C.getElement(e);return t&&t._owner?t._owner._debugID:null},getParentID:function(e){var t=l(e);return t?t.parentID:null},getSource:function(e){var t=l(e),n=t?t.element:null;return null!=n?n._source:null},getText:function(e){var t=C.getElement(e);return"string"==typeof t?t:"number"==typeof t?""+t:null},getUpdateCount:function(e){var t=l(e);return t?t.updateCount:0},getRootIDs:h,getRegisteredIDs:f,pushNonStandardWarningStack:function(e,t){if("function"==typeof console.reactStack){var n=[],r=v.current,o=r&&r._debugID;try{for(e&&n.push({name:o?C.getDisplayName(o):null,fileName:t?t.fileName:null,lineNumber:t?t.lineNumber:null});o;){var a=C.getElement(o),i=C.getParentID(o),u=C.getOwnerID(o),s=u?C.getDisplayName(u):null,l=a&&a._source;n.push({name:s,fileName:l?l.fileName:null,lineNumber:l?l.lineNumber:null}),o=i}}catch(e){}console.reactStack(n)}},popNonStandardWarningStack:function(){"function"==typeof console.reactStackEnd&&console.reactStackEnd()}};e.exports=C},function(e,t,n){"use strict";var r=n(11),o={listen:function(e,t,n){return e.addEventListener?(e.addEventListener(t,n,!1),{remove:function(){e.removeEventListener(t,n,!1)}}):e.attachEvent?(e.attachEvent("on"+t,n),{remove:function(){e.detachEvent("on"+t,n)}}):void 0},capture:function(e,t,n){return e.addEventListener?(e.addEventListener(t,n,!0),{remove:function(){e.removeEventListener(t,n,!0)}}):{remove:r}},registerDefault:function(){}};e.exports=o},function(e,t,n){"use strict";function r(e){return a(document.documentElement,e)}var o=n(236),a=n(238),i=n(108),u=n(121),s={hasSelectionCapabilities:function(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&("input"===t&&"text"===e.type||"textarea"===t||"true"===e.contentEditable)},getSelectionInformation:function(){var e=u();return{focusedElem:e,selectionRange:s.hasSelectionCapabilities(e)?s.getSelection(e):null}},restoreSelection:function(e){var t=u(),n=e.focusedElem,o=e.selectionRange;t!==n&&r(n)&&(s.hasSelectionCapabilities(n)&&s.setSelection(n,o),i(n))},getSelection:function(e){var t;if("selectionStart"in e)t={start:e.selectionStart,end:e.selectionEnd};else if(document.selection&&e.nodeName&&"input"===e.nodeName.toLowerCase()){var n=document.selection.createRange();n.parentElement()===e&&(t={start:-n.moveStart("character",-e.value.length),end:-n.moveEnd("character",-e.value.length)})}else t=o.getOffsets(e);return t||{start:0,end:0}},setSelection:function(e,t){var n=t.start,r=t.end;if(void 0===r&&(r=n),"selectionStart"in e)e.selectionStart=n,e.selectionEnd=Math.min(r,e.value.length);else if(document.selection&&e.nodeName&&"input"===e.nodeName.toLowerCase()){var a=e.createTextRange();a.collapse(!0),a.moveStart("character",n),a.moveEnd("character",r-n),a.select()}else o.setOffsets(e,t)}};e.exports=s},function(e,t,n){"use strict";function r(e){if(void 0===(e=e||("undefined"!=typeof document?document:void 0)))return null;try{return e.activeElement||e.body}catch(t){return e.body}}e.exports=r},function(e,t,n){"use strict";function r(e,t){for(var n=Math.min(e.length,t.length),r=0;r<n;r++)if(e.charAt(r)!==t.charAt(r))return r;return e.length===t.length?-1:n}function o(e){return e?e.nodeType===I?e.documentElement:e.firstChild:null}function a(e){return e.getAttribute&&e.getAttribute(R)||""}function i(e,t,n,r,o){var a;if(w.logTopLevelRenders){var i=e._currentElement.props.child,u=i.type;a="React mount: "+("string"==typeof u?u:u.displayName||u.name),console.time(a)}var s=P.mountComponent(e,n,null,b(e,t),o,0);a&&console.timeEnd(a),e._renderedComponent._topLevelWrapper=e,F._mountImageIntoNode(s,t,e,r,n)}function u(e,t,n,r){var o=x.ReactReconcileTransaction.getPooled(!n&&_.useCreateElement);o.perform(i,null,e,t,o,n,r),x.ReactReconcileTransaction.release(o)}function s(e,t,n){for(P.unmountComponent(e,n),t.nodeType===I&&(t=t.documentElement);t.lastChild;)t.removeChild(t.lastChild)}function l(e){var t=o(e);if(t){var n=g.getInstanceFromNode(t);return!(!n||!n._hostParent)}}function c(e){return!(!e||e.nodeType!==M&&e.nodeType!==I&&e.nodeType!==A)}function f(e){var t=o(e),n=t&&g.getInstanceFromNode(t);return n&&!n._hostParent?n:null}function p(e){var t=f(e);return t?t._hostContainerInfo._topLevelWrapper:null}var d=n(3),h=n(28),y=n(26),v=n(24),m=n(46),g=(n(17),n(6)),b=n(253),_=n(254),w=n(103),E=n(35),O=(n(13),n(255)),P=n(27),C=n(72),x=n(14),k=n(41),S=n(113),T=(n(1),n(44)),j=n(70),R=(n(2),y.ID_ATTRIBUTE_NAME),N=y.ROOT_ATTRIBUTE_NAME,M=1,I=9,A=11,D={},L=1,U=function(){this.rootID=L++};U.prototype.isReactComponent={},U.prototype.render=function(){return this.props.child},U.isReactTopLevelWrapper=!0;var F={TopLevelWrapper:U,_instancesByReactRootID:D,scrollMonitor:function(e,t){t()},_updateRootComponent:function(e,t,n,r,o){return F.scrollMonitor(r,function(){C.enqueueElementInternal(e,t,n),o&&C.enqueueCallbackInternal(e,o)}),e},_renderNewRootComponent:function(e,t,n,r){c(t)||d("37"),m.ensureScrollValueMonitoring();var o=S(e,!1);x.batchedUpdates(u,o,t,n,r);var a=o._instance.rootID;return D[a]=o,o},renderSubtreeIntoContainer:function(e,t,n,r){return null!=e&&E.has(e)||d("38"),F._renderSubtreeIntoContainer(e,t,n,r)},_renderSubtreeIntoContainer:function(e,t,n,r){C.validateCallback(r,"ReactDOM.render"),v.isValidElement(t)||d("39","string"==typeof t?" Instead of passing a string like 'div', pass React.createElement('div') or <div />.":"function"==typeof t?" Instead of passing a class like Foo, pass React.createElement(Foo) or <Foo />.":null!=t&&void 0!==t.props?" This may be caused by unintentionally loading two independent copies of React.":"");var i,u=v.createElement(U,{child:t});if(e){var s=E.get(e);i=s._processChildContext(s._context)}else i=k;var c=p(n);if(c){var f=c._currentElement,h=f.props.child;if(j(h,t)){var y=c._renderedComponent.getPublicInstance(),m=r&&function(){r.call(y)};return F._updateRootComponent(c,u,i,n,m),y}F.unmountComponentAtNode(n)}var g=o(n),b=g&&!!a(g),_=l(n),w=b&&!c&&!_,O=F._renderNewRootComponent(u,n,w,i)._renderedComponent.getPublicInstance();return r&&r.call(O),O},render:function(e,t,n){return F._renderSubtreeIntoContainer(null,e,t,n)},unmountComponentAtNode:function(e){c(e)||d("40");var t=p(e);if(!t){l(e),1===e.nodeType&&e.hasAttribute(N);return!1}return delete D[t._instance.rootID],x.batchedUpdates(s,t,e,!1),!0},_mountImageIntoNode:function(e,t,n,a,i){if(c(t)||d("41"),a){var u=o(t);if(O.canReuseMarkup(e,u))return void g.precacheNode(n,u);var s=u.getAttribute(O.CHECKSUM_ATTR_NAME);u.removeAttribute(O.CHECKSUM_ATTR_NAME);var l=u.outerHTML;u.setAttribute(O.CHECKSUM_ATTR_NAME,s);var f=e,p=r(f,l),y=" (client) "+f.substring(p-20,p+20)+"\n (server) "+l.substring(p-20,p+20);t.nodeType===I&&d("42",y)}if(t.nodeType===I&&d("43"),i.useCreateElement){for(;t.lastChild;)t.removeChild(t.lastChild);h.insertTreeBefore(t,e,null)}else T(t,e),g.precacheNode(n,t.firstChild)}};e.exports=F},function(e,t,n){"use strict";function r(e){for(var t;(t=e._renderedNodeType)===o.COMPOSITE;)e=e._renderedComponent;return t===o.HOST?e._renderedComponent:t===o.EMPTY?null:void 0}var o=n(114);e.exports=r},function(e,t,n){"use strict";n.d(t,"b",function(){return a}),n.d(t,"a",function(){return i});var r=n(5),o=n.n(r),a=o.a.shape({trySubscribe:o.a.func.isRequired,tryUnsubscribe:o.a.func.isRequired,notifyNestedSubs:o.a.func.isRequired,isSubscribed:o.a.func.isRequired}),i=o.a.shape({subscribe:o.a.func.isRequired,dispatch:o.a.func.isRequired,getState:o.a.func.isRequired})},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function i(e,t){var n={};for(var r in e)t.indexOf(r)>=0||Object.prototype.hasOwnProperty.call(e,r)&&(n[r]=e[r]);return n}function u(){}function s(e,t){var n={run:function(r){try{var o=e(t.getState(),r);(o!==n.props||n.error)&&(n.shouldComponentUpdate=!0,n.props=o,n.error=null)}catch(e){n.shouldComponentUpdate=!0,n.error=e}}};return n}function l(e){var t,n,l=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},c=l.getDisplayName,p=void 0===c?function(e){return"ConnectAdvanced("+e+")"}:c,_=l.methodName,w=void 0===_?"connectAdvanced":_,E=l.renderCountProp,O=void 0===E?void 0:E,P=l.shouldHandleStateChanges,C=void 0===P||P,x=l.storeKey,k=void 0===x?"store":x,S=l.withRef,T=void 0!==S&&S,j=i(l,["getDisplayName","methodName","renderCountProp","shouldHandleStateChanges","storeKey","withRef"]),R=k+"Subscription",N=g++,M=(t={},t[k]=v.a,t[R]=v.b,t),I=(n={},n[R]=v.b,n);return function(t){d()("function"==typeof t,"You must pass a component to the function returned by connect. Instead received "+JSON.stringify(t));var n=t.displayName||t.name||"Component",i=p(n),l=m({},j,{getDisplayName:p,methodName:w,renderCountProp:O,shouldHandleStateChanges:C,storeKey:k,withRef:T,displayName:i,wrappedComponentName:n,WrappedComponent:t}),c=function(n){function c(e,t){r(this,c);var a=o(this,n.call(this,e,t));return a.version=N,a.state={},a.renderCount=0,a.store=e[k]||t[k],a.propsMode=Boolean(e[k]),a.setWrappedInstance=a.setWrappedInstance.bind(a),d()(a.store,'Could not find "'+k+'" in either the context or props of "'+i+'". Either wrap the root component in a <Provider>, or explicitly pass "'+k+'" as a prop to "'+i+'".'),a.initSelector(),a.initSubscription(),a}return a(c,n),c.prototype.getChildContext=function(){var e,t=this.propsMode?null:this.subscription;return e={},e[R]=t||this.context[R],e},c.prototype.componentDidMount=function(){C&&(this.subscription.trySubscribe(),this.selector.run(this.props),this.selector.shouldComponentUpdate&&this.forceUpdate())},c.prototype.componentWillReceiveProps=function(e){this.selector.run(e)},c.prototype.shouldComponentUpdate=function(){return this.selector.shouldComponentUpdate},c.prototype.componentWillUnmount=function(){this.subscription&&this.subscription.tryUnsubscribe(),this.subscription=null,this.notifyNestedSubs=u,this.store=null,this.selector.run=u,this.selector.shouldComponentUpdate=!1},c.prototype.getWrappedInstance=function(){return d()(T,"To access the wrapped instance, you need to specify { withRef: true } in the options argument of the "+w+"() call."),this.wrappedInstance},c.prototype.setWrappedInstance=function(e){this.wrappedInstance=e},c.prototype.initSelector=function(){var t=e(this.store.dispatch,l);this.selector=s(t,this.store),this.selector.run(this.props)},c.prototype.initSubscription=function(){if(C){var e=(this.propsMode?this.props:this.context)[R];this.subscription=new y.a(this.store,e,this.onStateChange.bind(this)),this.notifyNestedSubs=this.subscription.notifyNestedSubs.bind(this.subscription)}},c.prototype.onStateChange=function(){this.selector.run(this.props),this.selector.shouldComponentUpdate?(this.componentDidUpdate=this.notifyNestedSubsOnComponentDidUpdate,this.setState(b)):this.notifyNestedSubs()},c.prototype.notifyNestedSubsOnComponentDidUpdate=function(){this.componentDidUpdate=void 0,this.notifyNestedSubs()},c.prototype.isSubscribed=function(){return Boolean(this.subscription)&&this.subscription.isSubscribed()},c.prototype.addExtraProps=function(e){if(!(T||O||this.propsMode&&this.subscription))return e;var t=m({},e);return T&&(t.ref=this.setWrappedInstance),O&&(t[O]=this.renderCount++),this.propsMode&&this.subscription&&(t[R]=this.subscription),t},c.prototype.render=function(){var e=this.selector;if(e.shouldComponentUpdate=!1,e.error)throw e.error;return Object(h.createElement)(t,this.addExtraProps(e.props))},c}(h.Component);return c.WrappedComponent=t,c.displayName=i,c.childContextTypes=I,c.contextTypes=M,c.propTypes=M,f()(c,t)}}t.a=l;var c=n(126),f=n.n(c),p=n(12),d=n.n(p),h=n(0),y=(n.n(h),n(263)),v=n(124),m=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},g=0,b={}},function(e,t,n){"use strict";var r={childContextTypes:!0,contextTypes:!0,defaultProps:!0,displayName:!0,getDefaultProps:!0,mixins:!0,propTypes:!0,type:!0},o={name:!0,length:!0,prototype:!0,caller:!0,callee:!0,arguments:!0,arity:!0},a=Object.defineProperty,i=Object.getOwnPropertyNames,u=Object.getOwnPropertySymbols,s=Object.getOwnPropertyDescriptor,l=Object.getPrototypeOf,c=l&&l(Object);e.exports=function e(t,n,f){if("string"!=typeof n){if(c){var p=l(n);p&&p!==c&&e(t,p,f)}var d=i(n);u&&(d=d.concat(u(n)));for(var h=0;h<d.length;++h){var y=d[h];if(!(r[y]||o[y]||f&&f[y])){var v=s(n,y);try{a(t,y,v)}catch(e){}}}return t}return t}},function(e,t,n){"use strict";function r(e,t,n){function a(){m===v&&(m=v.slice())}function s(){return y}function l(e){if("function"!=typeof e)throw new Error("Expected listener to be a function.");var t=!0;return a(),m.push(e),function(){if(t){t=!1,a();var n=m.indexOf(e);m.splice(n,1)}}}function c(e){if(!Object(o.a)(e))throw new Error("Actions must be plain objects. Use custom middleware for async actions.");if(void 0===e.type)throw new Error('Actions may not have an undefined "type" property. Have you misspelled a constant?');if(g)throw new Error("Reducers may not dispatch actions.");try{g=!0,y=h(y,e)}finally{g=!1}for(var t=v=m,n=0;n<t.length;n++){(0,t[n])()}return e}function f(e){if("function"!=typeof e)throw new Error("Expected the nextReducer to be a function.");h=e,c({type:u.INIT})}function p(){var e,t=l;return e={subscribe:function(e){function n(){e.next&&e.next(s())}if("object"!=typeof e)throw new TypeError("Expected the observer to be an object.");return n(),{unsubscribe:t(n)}}},e[i.a]=function(){return this},e}var d;if("function"==typeof t&&void 0===n&&(n=t,t=void 0),void 0!==n){if("function"!=typeof n)throw new Error("Expected the enhancer to be a function.");return n(r)(e,t)}if("function"!=typeof e)throw new Error("Expected the reducer to be a function.");var h=e,y=t,v=[],m=v,g=!1;return c({type:u.INIT}),d={dispatch:c,subscribe:l,getState:s,replaceReducer:f},d[i.a]=p,d}n.d(t,"a",function(){return u}),t.b=r;var o=n(76),a=n(275),i=n.n(a),u={INIT:"@@redux/INIT"}},function(e,t,n){"use strict";var r=n(268),o=r.a.Symbol;t.a=o},function(e,t,n){"use strict"},function(e,t,n){"use strict";function r(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];return 0===t.length?function(e){return e}:1===t.length?t[0]:t.reduce(function(e,t){return function(){return e(t.apply(void 0,arguments))}})}t.a=r},function(e,t,n){"use strict";function r(e){return function(t,n){function r(){return o}var o=e(t,n);return r.dependsOnOwnProps=!1,r}}function o(e){return null!==e.dependsOnOwnProps&&void 0!==e.dependsOnOwnProps?Boolean(e.dependsOnOwnProps):1!==e.length}function a(e,t){return function(t,n){var r=(n.displayName,function(e,t){return r.dependsOnOwnProps?r.mapToProps(e,t):r.mapToProps(e)});return r.dependsOnOwnProps=!0,r.mapToProps=function(t,n){r.mapToProps=e,r.dependsOnOwnProps=o(e);var a=r(t,n);return"function"==typeof a&&(r.mapToProps=a,r.dependsOnOwnProps=o(a),a=r(t,n)),a},r}}t.a=r,t.b=a;n(132)},function(e,t,n){"use strict";n(76),n(75)},function(e,t,n){"use strict";function r(e){return"/"===e.charAt(0)}function o(e,t){for(var n=t,r=n+1,o=e.length;r<o;n+=1,r+=1)e[n]=e[r];e.pop()}function a(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"",n=e&&e.split("/")||[],a=t&&t.split("/")||[],i=e&&r(e),u=t&&r(t),s=i||u;if(e&&r(e)?a=n:n.length&&(a.pop(),a=a.concat(n)),!a.length)return"/";var l=void 0;if(a.length){var c=a[a.length-1];l="."===c||".."===c||""===c}else l=!1;for(var f=0,p=a.length;p>=0;p--){var d=a[p];"."===d?o(a,p):".."===d?(o(a,p),f++):f&&(o(a,p),f--)}if(!s)for(;f--;f)a.unshift("..");!s||""===a[0]||a[0]&&r(a[0])||a.unshift("");var h=a.join("/");return l&&"/"!==h.substr(-1)&&(h+="/"),h}Object.defineProperty(t,"__esModule",{value:!0}),t.default=a},function(e,t,n){"use strict";function r(e,t){if(e===t)return!0;if(null==e||null==t)return!1;if(Array.isArray(e))return Array.isArray(t)&&e.length===t.length&&e.every(function(e,n){return r(e,t[n])});var n=void 0===e?"undefined":o(e);if(n!==(void 0===t?"undefined":o(t)))return!1;if("object"===n){var a=e.valueOf(),i=t.valueOf();if(a!==e||i!==t)return r(a,i);var u=Object.keys(e),s=Object.keys(t);return u.length===s.length&&u.every(function(n){return r(e[n],t[n])})}return!1}Object.defineProperty(t,"__esModule",{value:!0});var o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};t.default=r},function(e,t,n){"use strict";t.__esModule=!0;t.canUseDOM=!("undefined"==typeof window||!window.document||!window.document.createElement),t.addEventListener=function(e,t,n){return e.addEventListener?e.addEventListener(t,n,!1):e.attachEvent("on"+t,n)},t.removeEventListener=function(e,t,n){return e.removeEventListener?e.removeEventListener(t,n,!1):e.detachEvent("on"+t,n)},t.getConfirmation=function(e,t){return t(window.confirm(e))},t.supportsHistory=function(){var e=window.navigator.userAgent;return(-1===e.indexOf("Android 2.")&&-1===e.indexOf("Android 4.0")||-1===e.indexOf("Mobile Safari")||-1!==e.indexOf("Chrome")||-1!==e.indexOf("Windows Phone"))&&(window.history&&"pushState"in window.history)},t.supportsPopStateOnHashChange=function(){return-1===window.navigator.userAgent.indexOf("Trident")},t.supportsGoWithoutReloadUsingHash=function(){return-1===window.navigator.userAgent.indexOf("Firefox")},t.isExtraneousPopstateEvent=function(e){return void 0===e.state&&-1===navigator.userAgent.indexOf("CriOS")}},function(e,t,n){"use strict";function r(e,t){var n={};for(var r in e)t.indexOf(r)>=0||Object.prototype.hasOwnProperty.call(e,r)&&(n[r]=e[r]);return n}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var u=n(0),s=n.n(u),l=n(5),c=n.n(l),f=n(12),p=n.n(f),d=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},h=function(e){return!!(e.metaKey||e.altKey||e.ctrlKey||e.shiftKey)},y=function(e){function t(){var n,r,i;o(this,t);for(var u=arguments.length,s=Array(u),l=0;l<u;l++)s[l]=arguments[l];return n=r=a(this,e.call.apply(e,[this].concat(s))),r.handleClick=function(e){if(r.props.onClick&&r.props.onClick(e),!e.defaultPrevented&&0===e.button&&!r.props.target&&!h(e)){e.preventDefault();var t=r.context.router.history,n=r.props,o=n.replace,a=n.to;o?t.replace(a):t.push(a)}},i=n,a(r,i)}return i(t,e),t.prototype.render=function(){var e=this.props,t=(e.replace,e.to),n=e.innerRef,o=r(e,["replace","to","innerRef"]);p()(this.context.router,"You should not use <Link> outside a <Router>");var a=this.context.router.history.createHref("string"==typeof t?{pathname:t}:t);return s.a.createElement("a",d({},o,{onClick:this.handleClick,href:a,ref:n}))},t}(s.a.Component);y.propTypes={onClick:c.a.func,target:c.a.string,replace:c.a.bool,to:c.a.oneOfType([c.a.string,c.a.object]).isRequired,innerRef:c.a.oneOfType([c.a.string,c.a.func])},y.defaultProps={replace:!1},y.contextTypes={router:c.a.shape({history:c.a.shape({push:c.a.func.isRequired,replace:c.a.func.isRequired,createHref:c.a.func.isRequired}).isRequired}).isRequired},t.a=y},function(e,t,n){"use strict";var r=n(138);t.a=r.a},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var i=n(7),u=n.n(i),s=n(12),l=n.n(s),c=n(0),f=n.n(c),p=n(5),d=n.n(p),h=n(81),y=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},v=function(e){return 0===f.a.Children.count(e)},m=function(e){function t(){var n,a,i;r(this,t);for(var u=arguments.length,s=Array(u),l=0;l<u;l++)s[l]=arguments[l];return n=a=o(this,e.call.apply(e,[this].concat(s))),a.state={match:a.computeMatch(a.props,a.context.router)},i=n,o(a,i)}return a(t,e),t.prototype.getChildContext=function(){return{router:y({},this.context.router,{route:{location:this.props.location||this.context.router.route.location,match:this.state.match}})}},t.prototype.computeMatch=function(e,t){var n=e.computedMatch,r=e.location,o=e.path,a=e.strict,i=e.exact,u=e.sensitive;if(n)return n;l()(t,"You should not use <Route> or withRouter() outside a <Router>");var s=t.route,c=(r||s.location).pathname;return o?Object(h.a)(c,{path:o,strict:a,exact:i,sensitive:u}):s.match},t.prototype.componentWillMount=function(){u()(!(this.props.component&&this.props.render),"You should not use <Route component> and <Route render> in the same route; <Route render> will be ignored"),u()(!(this.props.component&&this.props.children&&!v(this.props.children)),"You should not use <Route component> and <Route children> in the same route; <Route children> will be ignored"),u()(!(this.props.render&&this.props.children&&!v(this.props.children)),"You should not use <Route render> and <Route children> in the same route; <Route children> will be ignored")},t.prototype.componentWillReceiveProps=function(e,t){u()(!(e.location&&!this.props.location),'<Route> elements should not change from uncontrolled to controlled (or vice versa). You initially used no "location" prop and then provided one on a subsequent render.'),u()(!(!e.location&&this.props.location),'<Route> elements should not change from controlled to uncontrolled (or vice versa). You provided a "location" prop initially but omitted it on a subsequent render.'),this.setState({match:this.computeMatch(e,t.router)})},t.prototype.render=function(){var e=this.state.match,t=this.props,n=t.children,r=t.component,o=t.render,a=this.context.router,i=a.history,u=a.route,s=a.staticContext,l=this.props.location||u.location,c={match:e,location:l,history:i,staticContext:s};return r?e?f.a.createElement(r,c):null:o?e?o(c):null:n?"function"==typeof n?n(c):v(n)?null:f.a.Children.only(n):null},t}(f.a.Component);m.propTypes={computedMatch:d.a.object,path:d.a.string,exact:d.a.bool,strict:d.a.bool,sensitive:d.a.bool,component:d.a.func,render:d.a.func,children:d.a.oneOfType([d.a.func,d.a.node]),location:d.a.object},m.contextTypes={router:d.a.shape({history:d.a.object.isRequired,route:d.a.object.isRequired,staticContext:d.a.object})},m.childContextTypes={router:d.a.object.isRequired},t.a=m},function(e,t,n){"use strict";n.d(t,"b",function(){return r}),n.d(t,"a",function(){return o}),n.d(t,"e",function(){return a}),n.d(t,"c",function(){return i}),n.d(t,"g",function(){return u}),n.d(t,"h",function(){return s}),n.d(t,"f",function(){return l}),n.d(t,"d",function(){return c});var r=!("undefined"==typeof window||!window.document||!window.document.createElement),o=function(e,t,n){return e.addEventListener?e.addEventListener(t,n,!1):e.attachEvent("on"+t,n)},a=function(e,t,n){return e.removeEventListener?e.removeEventListener(t,n,!1):e.detachEvent("on"+t,n)},i=function(e,t){return t(window.confirm(e))},u=function(){var e=window.navigator.userAgent;return(-1===e.indexOf("Android 2.")&&-1===e.indexOf("Android 4.0")||-1===e.indexOf("Mobile Safari")||-1!==e.indexOf("Chrome")||-1!==e.indexOf("Windows Phone"))&&(window.history&&"pushState"in window.history)},s=function(){return-1===window.navigator.userAgent.indexOf("Trident")},l=function(){return-1===window.navigator.userAgent.indexOf("Firefox")},c=function(e){return void 0===e.state&&-1===navigator.userAgent.indexOf("CriOS")}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.ProtectedRoute=t.AuthRoute=void 0;var r=n(0),o=function(e){return e&&e.__esModule?e:{default:e}}(r),a=n(10),i=n(8),u=function(e){var t=e.component,n=e.path,r=e.loggedIn;return o.default.createElement(i.Route,{path:n,render:function(e){return r?o.default.createElement(i.Redirect,{to:"/"}):o.default.createElement(t,e)}})},s=function(e){var t=e.component,n=e.path,r=e.loggedIn;return o.default.createElement(i.Route,{path:n,render:function(e){return r?o.default.createElement(t,e):o.default.createElement(i.Redirect,{to:"/splash"})}})},l=function(e){return{loggedIn:Boolean(e.session.currentUser)}};t.AuthRoute=(0,i.withRouter)((0,a.connect)(l,null)(u)),t.ProtectedRoute=(0,i.withRouter)((0,a.connect)(l,null)(s))},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(0),o=function(e){return e&&e.__esModule?e:{default:e}}(r),a=function(){return o.default.createElement("div",{className:"global-separator-container"},o.default.createElement("div",{className:"global-separator-line"}),o.default.createElement("div",{className:"global-separator-line"}))};t.default=a},function(e,t,n){"use strict";function r(e){return e.offsetWidth<=0&&e.offsetHeight<=0||"none"===e.style.display}function o(e){for(var t=e;t&&t!==document.body;){if(r(t))return!1;t=t.parentNode}return!0}function a(e,t){var n=e.nodeName.toLowerCase();return(s.test(n)&&!e.disabled||("a"===n?e.href||t:t))&&o(e)}function i(e){var t=e.getAttribute("tabindex");null===t&&(t=void 0);var n=isNaN(t);return(n||t>=0)&&a(e,!n)}function u(e){return[].slice.call(e.querySelectorAll("*"),0).filter(i)}Object.defineProperty(t,"__esModule",{value:!0}),t.default=u;/*!
 * Adapted from jQuery UI core
 *
 * http://jqueryui.com
 *
 * Copyright 2014 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/category/ui-core/
 */
var s=/input|select|textarea|button|object/;e.exports=t.default},function(e,t,n){"use strict";function r(e,t){if(!e||!e.length)throw new Error("react-modal: No elements were found for selector "+t+".")}function o(e){var t=e;if("string"==typeof t){var n=document.querySelectorAll(t);r(n,t),t="length"in n?n[0]:n}return f=t||f}function a(){return!(!document||!document.body)&&(o(document.body),!0)}function i(e){if(!e&&!f&&!a())throw new Error(["react-modal: Cannot fallback to `document.body`, because it's not ready or available.","If you are doing server-side rendering, use this function to defined an element.","`Modal.setAppElement(el)` to make this accessible"])}function u(e){i(e),(e||f).setAttribute("aria-hidden","true")}function s(e){i(e),(e||f).removeAttribute("aria-hidden")}function l(){f=null}function c(){f=document.body}Object.defineProperty(t,"__esModule",{value:!0}),t.assertNodeList=r,t.setElement=o,t.tryForceFallback=a,t.validateElement=i,t.hide=u,t.show=s,t.documentNotReadyOrSSRTesting=l,t.resetForTesting=c;var f=null},function(e,t,n){"use strict";function r(){return u}function o(e){return u[e]||(u[e]=0),u[e]+=1,e}function a(e){return u[e]&&(u[e]-=1),e}function i(){return Object.keys(u).reduce(function(e,t){return e+u[t]},0)}Object.defineProperty(t,"__esModule",{value:!0}),t.get=r,t.add=o,t.remove=a,t.totalCount=i;var u={}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(333),o=function(e){return e&&e.__esModule?e:{default:e}}(r),a=o.default,i=a.canUseDOM?window.HTMLElement:{};t.default=i,e.exports=t.default},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(10),o=n(147),a=n(334),i=function(e){return e&&e.__esModule?e:{default:e}}(a),u=function(e,t){var n=t.collection;return{image_url:n.image_url,media_name:n.name,media_author:n.author_id,media_author_name:n.author_name,detail_url:"/user/"+n.author_id+"/playlist/"+n.id,author_url:"/user/"+n.author_id}},s=function(e){return{reproduceCollection:function(t){return e((0,o.reproduceCollection)(t))}}};t.default=(0,r.connect)(u,s)(i.default)},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=t.REPRODUCE_COLLECTION="PLAY_COLLECTION";t.reproduceCollection=function(e){return{type:r,collection:e}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(10),o=n(8),a=n(15),i=n(340),u=function(e){return e&&e.__esModule?e:{default:e}}(i),s=n(49),l=function(e,t){var n=t.collectionType,r=t.collection,o=t.songs,a=!1;return n===s.PLAYLIST_COLLECTION&&(a=r.author_id===e.session.currentUser.id),{collection:r,songs:o,showDelete:a,collectionType:n}},c=function(e){return{updatePlaylist:function(t){return e((0,a.updatePlaylist)(t))},fetchPlaylists:function(){return e((0,a.fetchPlaylists)())}}};t.default=(0,o.withRouter)((0,r.connect)(l,c)(u.default))},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.formatSeconds=function(e){var t=Math.floor(e/60);e=Math.floor(e%60);var n=e;return(t<10?"0"+t:t)+":"+(n<10?"0"+n:n)}},function(e,t,n){var r=n(85),o=n(30),a=r(o,"Map");e.exports=a},function(e,t,n){var r=n(30),o=r.Symbol;e.exports=o},function(e,t,n){(function(t){var n="object"==typeof t&&t&&t.Object===Object&&t;e.exports=n}).call(t,n(36))},function(e,t,n){function r(e,t,n){(void 0===n||a(e[t],n))&&(void 0!==n||t in e)||o(e,t,n)}var o=n(87),a=n(52);e.exports=r},function(e,t,n){var r=n(85),o=function(){try{var e=r(Object,"defineProperty");return e({},"",{}),e}catch(e){}}();e.exports=o},function(e,t,n){var r=n(387),o=r(Object.getPrototypeOf,Object);e.exports=o},function(e,t){function n(e){var t=e&&e.constructor;return e===("function"==typeof t&&t.prototype||r)}var r=Object.prototype;e.exports=n},function(e,t,n){var r=n(388),o=n(40),a=Object.prototype,i=a.hasOwnProperty,u=a.propertyIsEnumerable,s=r(function(){return arguments}())?r:function(e){return o(e)&&i.call(e,"callee")&&!u.call(e,"callee")};e.exports=s},function(e,t){var n=Array.isArray;e.exports=n},function(e,t){function n(e){return"number"==typeof e&&e>-1&&e%1==0&&e<=r}var r=9007199254740991;e.exports=n},function(e,t,n){(function(e){var r=n(30),o=n(390),a="object"==typeof t&&t&&!t.nodeType&&t,i=a&&"object"==typeof e&&e&&!e.nodeType&&e,u=i&&i.exports===a,s=u?r.Buffer:void 0,l=s?s.isBuffer:void 0,c=l||o;e.exports=c}).call(t,n(37)(e))},function(e,t,n){var r=n(392),o=n(393),a=n(394),i=a&&a.isTypedArray,u=i?o(i):r;e.exports=u},function(e,t,n){function r(e){return i(e)?o(e,!0):a(e)}var o=n(398),a=n(400),i=n(88);e.exports=r},function(e,t){function n(e,t){return!!(t=null==t?r:t)&&("number"==typeof e||o.test(e))&&e>-1&&e%1==0&&e<t}var r=9007199254740991,o=/^(?:0|[1-9]\d*)$/;e.exports=n},function(e,t){function n(e){return e}e.exports=n},function(e,t,n){"use strict";function r(e,t,n){var r=void 0,o=0,a=0,l=!1,c=[],f=e[t];return(0,u.deepForEach)(f,function(e){(0,s.isTabList)(e)&&(e.props&&e.props.children&&"object"===i(e.props.children)&&(0,u.deepForEach)(e.props.children,function(e){return c.push(e)}),l&&(r=new Error("Found multiple 'TabList' components inside 'Tabs'. Only one is allowed.")),l=!0),(0,s.isTab)(e)?(l&&-1!==c.indexOf(e)||(r=new Error("Found a 'Tab' component outside of the 'TabList' component. 'Tab' components have to be inside the 'TabList' component.")),o++):(0,s.isTabPanel)(e)&&a++}),r||o===a||(r=new Error("There should be an equal number of 'Tab' and 'TabPanel' in `"+n+"`.Received "+o+" 'Tab' and "+a+" 'TabPanel'.")),r}function o(e,t,n,r,o){var a=e[t],u=o||t,s=null;return a&&"function"!=typeof a?s=new Error("Invalid "+r+" `"+u+"` of type `"+(void 0===a?"undefined":i(a))+"` supplied to `"+n+"`, expected `function`."):null!=e.selectedIndex&&null==a&&(s=new Error("The "+r+" `"+u+"` is marked as required in `"+n+"`, but its value is `undefined` or `null`.\n`onSelect` is required when `selectedIndex` is also set. Not doing so will make the tabs not do anything, as `selectedIndex` indicates that you want to handle the selected tab yourself.\nIf you only want to set the inital tab replace `selectedIndex` with `defaultIndex`.")),s}function a(e,t,n,r,o){var a=e[t],u=o||t,s=null;if(null!=a&&"number"!=typeof a)s=new Error("Invalid "+r+" `"+u+"` of type `"+(void 0===a?"undefined":i(a))+"` supplied to `"+n+"`, expected `number`.");else if(null!=e.defaultIndex&&null!=a)return new Error("The "+r+" `"+u+"` cannot be used together with `defaultIndex` in `"+n+"`.\nEither remove `"+u+"` to let `"+n+"` handle the selected tab internally or remove `defaultIndex` to handle it yourself.");return s}t.__esModule=!0;var i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};t.childrenPropType=r,t.onSelectPropType=o,t.selectedIndexPropType=a;var u=n(89),s=n(56)},function(e,t,n){"use strict";function r(){return"react-tabs-"+a++}function o(){a=0}t.__esModule=!0,t.default=r,t.reset=o;var a=0},function(e,t,n){"use strict";function r(e){var t=0;return(0,a.deepForEach)(e,function(e){(0,i.isTab)(e)&&t++}),t}function o(e){var t=0;return(0,a.deepForEach)(e,function(e){(0,i.isTabPanel)(e)&&t++}),t}t.__esModule=!0,t.getTabsCount=r,t.getPanelsCount=o;var a=n(89),i=n(56)},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var u=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},s=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),l=function e(t,n,r){null===t&&(t=Function.prototype);var o=Object.getOwnPropertyDescriptor(t,n);if(void 0===o){var a=Object.getPrototypeOf(t);return null===a?void 0:e(a,n,r)}if("value"in o)return o.value;var i=o.get;if(void 0!==i)return i.call(r)},c=n(0),f=r(c),p=n(19),d=r(p),h=n(16),y=/\.(m4a|mp4a|mpga|mp2|mp2a|mp3|m2a|m3a|wav|weba|aac|oga|spx)($|\?)/i,v=/\.(mp4|og[gv]|webm|mov|m4v)($|\?)/i,m=/\.(m3u8)($|\?)/i,g=/\.(mpd)($|\?)/i,b=function(e){function t(){var e,n,r,i;o(this,t);for(var s=arguments.length,l=Array(s),c=0;c<s;c++)l[c]=arguments[c];return n=r=a(this,(e=t.__proto__||Object.getPrototypeOf(t)).call.apply(e,[this].concat(l))),r.onSeek=function(e){r.props.onSeek(e.target.currentTime)},r.renderSource=function(e){if("string"==typeof e)return f.default.createElement("source",{key:e,src:e});var t=e.src,n=e.type;return f.default.createElement("source",{key:t,src:t,type:n})},r.renderTrack=function(e,t){return f.default.createElement("track",u({key:t},e))},r.ref=function(e){r.player=e},i=n,a(r,i)}return i(t,e),s(t,[{key:"componentDidMount",value:function(){this.addListeners(),l(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"componentDidMount",this).call(this)}},{key:"componentWillReceiveProps",value:function(e){this.shouldUseAudio(this.props)!==this.shouldUseAudio(e)&&this.removeListeners(),l(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"componentWillReceiveProps",this).call(this,e)}},{key:"componentDidUpdate",value:function(e){this.shouldUseAudio(this.props)!==this.shouldUseAudio(e)&&this.addListeners()}},{key:"componentWillUnmount",value:function(){this.removeListeners(),l(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"componentWillUnmount",this).call(this)}},{key:"addListeners",value:function(){var e=this.props,t=e.playsinline,n=e.onPause,r=e.onEnded,o=e.onError;this.player.addEventListener("canplay",this.onReady),this.player.addEventListener("play",this.onPlay),this.player.addEventListener("pause",n),this.player.addEventListener("seeked",this.onSeek),this.player.addEventListener("ended",r),this.player.addEventListener("error",o),t&&(this.player.setAttribute("playsinline",""),this.player.setAttribute("webkit-playsinline",""))}},{key:"removeListeners",value:function(){var e=this.props,t=e.onPause,n=e.onEnded,r=e.onError;this.player.removeEventListener("canplay",this.onReady),this.player.removeEventListener("play",this.onPlay),this.player.removeEventListener("pause",t),this.player.removeEventListener("seeked",this.onSeek),this.player.removeEventListener("ended",n),this.player.removeEventListener("error",r)}},{key:"shouldUseAudio",value:function(e){return y.test(e.url)||e.config.file.forceAudio}},{key:"shouldUseHLS",value:function(e){return m.test(e)||this.props.config.file.forceHLS}},{key:"shouldUseDASH",value:function(e){return g.test(e)||this.props.config.file.forceDASH}},{key:"load",value:function(e){var t=this;this.shouldUseHLS(e)&&(0,h.getSDK)("https://cdn.jsdelivr.net/hls.js/latest/hls.min.js","Hls").then(function(n){t.hls=new n,t.hls.loadSource(e),t.hls.attachMedia(t.player)}),this.shouldUseDASH(e)&&(0,h.getSDK)("https://cdnjs.cloudflare.com/ajax/libs/dashjs/2.5.0/dash.all.min.js","dashjs").then(function(n){var r=n.MediaPlayer().create();r.initialize(t.player,e,!0),r.getDebug().setLogToBrowserConsole(!1)})}},{key:"play",value:function(){this.player.play().catch(this.props.onError)}},{key:"pause",value:function(){this.player.pause()}},{key:"stop",value:function(){this.player.removeAttribute("src"),this.hls&&this.hls.detachMedia()}},{key:"seekTo",value:function(e){var n=l(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"seekTo",this).call(this,e);this.player.currentTime=n}},{key:"setVolume",value:function(e){this.player.volume=e}},{key:"setPlaybackRate",value:function(e){this.player.playbackRate=e}},{key:"getDuration",value:function(){return this.player.duration}},{key:"getCurrentTime",value:function(){return this.player.currentTime}},{key:"getSecondsLoaded",value:function(){return 0===this.player.buffered.length?0:this.player.buffered.end(0)}},{key:"render",value:function(){var e=this.props,t=e.url,n=e.loop,r=e.controls,o=e.config,a=e.width,i=e.height,s=this.shouldUseAudio(this.props),l=this.shouldUseHLS(t),c=this.shouldUseDASH(t),p=s?"audio":"video",d=t instanceof Array||l||c?void 0:t,h={width:a&&"auto"!==a?"100%":a,height:i&&"auto"!==i?"100%":i,display:t?"block":"none"};return f.default.createElement(p,u({ref:this.ref,src:d,style:h,preload:"auto",controls:r,loop:n},o.file.attributes),t instanceof Array&&t.map(this.renderSource),o.file.tracks.map(this.renderTrack))}}],[{key:"canPlay",value:function(e){if(e instanceof Array){var t=!0,n=!1,r=void 0;try{for(var o,a=e[Symbol.iterator]();!(t=(o=a.next()).done);t=!0){var i=o.value;if("string"==typeof i&&this.canPlay(i))return!0;if(this.canPlay(i.src))return!0}}catch(e){n=!0,r=e}finally{try{!t&&a.return&&a.return()}finally{if(n)throw r}}return!1}return y.test(e)||v.test(e)||m.test(e)||g.test(e)}}]),t}(d.default);b.displayName="FilePlayer",t.default=b},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}var o=n(0),a=r(o),i=n(97),u=r(i),s=n(260),l=r(s),c=n(440),f=r(c);document.addEventListener("DOMContentLoaded",function(){var e=void 0;if(window.currentUser&&window.currentUser.user_details){var t={session:{currentUser:window.currentUser.user_details}},n={};window.currentUser.friend_details&&(Object.values(window.currentUser.friends_details).forEach(function(e){n[e.id]=e}),t.users=n),e=(0,f.default)(t),delete window.currentUser.user_details}else e=(0,f.default)();var r=document.getElementById("root");u.default.render(a.default.createElement(l.default,{store:e}),r)})},function(e,t,n){"use strict";var r=function(){};e.exports=r},function(e,t,n){"use strict";function r(e){return(""+e).replace(_,"$&/")}function o(e,t){this.func=e,this.context=t,this.count=0}function a(e,t,n){var r=e.func,o=e.context;r.call(o,t,e.count++)}function i(e,t,n){if(null==e)return e;var r=o.getPooled(t,n);m(e,a,r),o.release(r)}function u(e,t,n,r){this.result=e,this.keyPrefix=t,this.func=n,this.context=r,this.count=0}function s(e,t,n){var o=e.result,a=e.keyPrefix,i=e.func,u=e.context,s=i.call(u,t,e.count++);Array.isArray(s)?l(s,o,n,v.thatReturnsArgument):null!=s&&(y.isValidElement(s)&&(s=y.cloneAndReplaceKey(s,a+(!s.key||t&&t.key===s.key?"":r(s.key)+"/")+n)),o.push(s))}function l(e,t,n,o,a){var i="";null!=n&&(i=r(n)+"/");var l=u.getPooled(t,i,o,a);m(e,s,l),u.release(l)}function c(e,t,n){if(null==e)return e;var r=[];return l(e,r,null,t,n),r}function f(e,t,n){return null}function p(e,t){return m(e,f,null)}function d(e){var t=[];return l(e,t,null,v.thatReturnsArgument),t}var h=n(172),y=n(25),v=n(11),m=n(173),g=h.twoArgumentPooler,b=h.fourArgumentPooler,_=/\/+/g;o.prototype.destructor=function(){this.func=null,this.context=null,this.count=0},h.addPoolingTo(o,g),u.prototype.destructor=function(){this.result=null,this.keyPrefix=null,this.func=null,this.context=null,this.count=0},h.addPoolingTo(u,b);var w={forEach:i,map:c,mapIntoWithKeyPrefixInternal:l,count:p,toArray:d};e.exports=w},function(e,t,n){"use strict";var r=n(31),o=(n(1),function(e){var t=this;if(t.instancePool.length){var n=t.instancePool.pop();return t.call(n,e),n}return new t(e)}),a=function(e,t){var n=this;if(n.instancePool.length){var r=n.instancePool.pop();return n.call(r,e,t),r}return new n(e,t)},i=function(e,t,n){var r=this;if(r.instancePool.length){var o=r.instancePool.pop();return r.call(o,e,t,n),o}return new r(e,t,n)},u=function(e,t,n,r){var o=this;if(o.instancePool.length){var a=o.instancePool.pop();return o.call(a,e,t,n,r),a}return new o(e,t,n,r)},s=function(e){var t=this;e instanceof t||r("25"),e.destructor(),t.instancePool.length<t.poolSize&&t.instancePool.push(e)},l=o,c=function(e,t){var n=e;return n.instancePool=[],n.getPooled=t||l,n.poolSize||(n.poolSize=10),n.release=s,n},f={addPoolingTo:c,oneArgumentPooler:o,twoArgumentPooler:a,threeArgumentPooler:i,fourArgumentPooler:u};e.exports=f},function(e,t,n){"use strict";function r(e,t){return e&&"object"==typeof e&&null!=e.key?l.escape(e.key):t.toString(36)}function o(e,t,n,a){var p=typeof e;if("undefined"!==p&&"boolean"!==p||(e=null),null===e||"string"===p||"number"===p||"object"===p&&e.$$typeof===u)return n(a,e,""===t?c+r(e,0):t),1;var d,h,y=0,v=""===t?c:t+f;if(Array.isArray(e))for(var m=0;m<e.length;m++)d=e[m],h=v+r(d,m),y+=o(d,h,n,a);else{var g=s(e);if(g){var b,_=g.call(e);if(g!==e.entries)for(var w=0;!(b=_.next()).done;)d=b.value,h=v+r(d,w++),y+=o(d,h,n,a);else for(;!(b=_.next()).done;){var E=b.value;E&&(d=E[1],h=v+l.escape(E[0])+f+r(d,0),y+=o(d,h,n,a))}}else if("object"===p){var O="",P=String(e);i("31","[object Object]"===P?"object with keys {"+Object.keys(e).join(", ")+"}":P,O)}}return y}function a(e,t,n){return null==e?0:o(e,"",t,n)}var i=n(31),u=(n(17),n(94)),s=n(174),l=(n(1),n(175)),c=(n(2),"."),f=":";e.exports=a},function(e,t,n){"use strict";function r(e){var t=e&&(o&&e[o]||e[a]);if("function"==typeof t)return t}var o="function"==typeof Symbol&&Symbol.iterator,a="@@iterator";e.exports=r},function(e,t,n){"use strict";function r(e){var t={"=":"=0",":":"=2"};return"$"+(""+e).replace(/[=:]/g,function(e){return t[e]})}function o(e){var t=/(=0|=2)/g,n={"=0":"=","=2":":"};return(""+("."===e[0]&&"$"===e[1]?e.substring(2):e.substring(1))).replace(t,function(e){return n[e]})}var a={escape:r,unescape:o};e.exports=a},function(e,t,n){"use strict";var r=n(25),o=r.createFactory,a={a:o("a"),abbr:o("abbr"),address:o("address"),area:o("area"),article:o("article"),aside:o("aside"),audio:o("audio"),b:o("b"),base:o("base"),bdi:o("bdi"),bdo:o("bdo"),big:o("big"),blockquote:o("blockquote"),body:o("body"),br:o("br"),button:o("button"),canvas:o("canvas"),caption:o("caption"),cite:o("cite"),code:o("code"),col:o("col"),colgroup:o("colgroup"),data:o("data"),datalist:o("datalist"),dd:o("dd"),del:o("del"),details:o("details"),dfn:o("dfn"),dialog:o("dialog"),div:o("div"),dl:o("dl"),dt:o("dt"),em:o("em"),embed:o("embed"),fieldset:o("fieldset"),figcaption:o("figcaption"),figure:o("figure"),footer:o("footer"),form:o("form"),h1:o("h1"),h2:o("h2"),h3:o("h3"),h4:o("h4"),h5:o("h5"),h6:o("h6"),head:o("head"),header:o("header"),hgroup:o("hgroup"),hr:o("hr"),html:o("html"),i:o("i"),iframe:o("iframe"),img:o("img"),input:o("input"),ins:o("ins"),kbd:o("kbd"),keygen:o("keygen"),label:o("label"),legend:o("legend"),li:o("li"),link:o("link"),main:o("main"),map:o("map"),mark:o("mark"),menu:o("menu"),menuitem:o("menuitem"),meta:o("meta"),meter:o("meter"),nav:o("nav"),noscript:o("noscript"),object:o("object"),ol:o("ol"),optgroup:o("optgroup"),option:o("option"),output:o("output"),p:o("p"),param:o("param"),picture:o("picture"),pre:o("pre"),progress:o("progress"),q:o("q"),rp:o("rp"),rt:o("rt"),ruby:o("ruby"),s:o("s"),samp:o("samp"),script:o("script"),section:o("section"),select:o("select"),small:o("small"),source:o("source"),span:o("span"),strong:o("strong"),style:o("style"),sub:o("sub"),summary:o("summary"),sup:o("sup"),table:o("table"),tbody:o("tbody"),td:o("td"),textarea:o("textarea"),tfoot:o("tfoot"),th:o("th"),thead:o("thead"),time:o("time"),title:o("title"),tr:o("tr"),track:o("track"),u:o("u"),ul:o("ul"),var:o("var"),video:o("video"),wbr:o("wbr"),circle:o("circle"),clipPath:o("clipPath"),defs:o("defs"),ellipse:o("ellipse"),g:o("g"),image:o("image"),line:o("line"),linearGradient:o("linearGradient"),mask:o("mask"),path:o("path"),pattern:o("pattern"),polygon:o("polygon"),polyline:o("polyline"),radialGradient:o("radialGradient"),rect:o("rect"),stop:o("stop"),svg:o("svg"),text:o("text"),tspan:o("tspan")};e.exports=a},function(e,t,n){"use strict";var r=n(25),o=r.isValidElement,a=n(95);e.exports=a(o)},function(e,t,n){"use strict";var r=n(11),o=n(1),a=n(2),i=n(96),u=n(179);e.exports=function(e,t){function n(e){var t=e&&(P&&e[P]||e[C]);if("function"==typeof t)return t}function s(e,t){return e===t?0!==e||1/e==1/t:e!==e&&t!==t}function l(e){this.message=e,this.stack=""}function c(e){function n(n,r,a,u,s,c,f){if(u=u||x,c=c||a,f!==i)if(t)o(!1,"Calling PropTypes validators directly is not supported by the `prop-types` package. Use `PropTypes.checkPropTypes()` to call them. Read more at http://fb.me/use-check-prop-types");else;return null==r[a]?n?new l(null===r[a]?"The "+s+" `"+c+"` is marked as required in `"+u+"`, but its value is `null`.":"The "+s+" `"+c+"` is marked as required in `"+u+"`, but its value is `undefined`."):null:e(r,a,u,s,c)}var r=n.bind(null,!1);return r.isRequired=n.bind(null,!0),r}function f(e){function t(t,n,r,o,a,i){var u=t[n];if(_(u)!==e)return new l("Invalid "+o+" `"+a+"` of type `"+w(u)+"` supplied to `"+r+"`, expected `"+e+"`.");return null}return c(t)}function p(e){function t(t,n,r,o,a){if("function"!=typeof e)return new l("Property `"+a+"` of component `"+r+"` has invalid PropType notation inside arrayOf.");var u=t[n];if(!Array.isArray(u)){return new l("Invalid "+o+" `"+a+"` of type `"+_(u)+"` supplied to `"+r+"`, expected an array.")}for(var s=0;s<u.length;s++){var c=e(u,s,r,o,a+"["+s+"]",i);if(c instanceof Error)return c}return null}return c(t)}function d(e){function t(t,n,r,o,a){if(!(t[n]instanceof e)){var i=e.name||x;return new l("Invalid "+o+" `"+a+"` of type `"+O(t[n])+"` supplied to `"+r+"`, expected instance of `"+i+"`.")}return null}return c(t)}function h(e){function t(t,n,r,o,a){for(var i=t[n],u=0;u<e.length;u++)if(s(i,e[u]))return null;return new l("Invalid "+o+" `"+a+"` of value `"+i+"` supplied to `"+r+"`, expected one of "+JSON.stringify(e)+".")}return Array.isArray(e)?c(t):r.thatReturnsNull}function y(e){function t(t,n,r,o,a){if("function"!=typeof e)return new l("Property `"+a+"` of component `"+r+"` has invalid PropType notation inside objectOf.");var u=t[n],s=_(u);if("object"!==s)return new l("Invalid "+o+" `"+a+"` of type `"+s+"` supplied to `"+r+"`, expected an object.");for(var c in u)if(u.hasOwnProperty(c)){var f=e(u,c,r,o,a+"."+c,i);if(f instanceof Error)return f}return null}return c(t)}function v(e){function t(t,n,r,o,a){for(var u=0;u<e.length;u++){if(null==(0,e[u])(t,n,r,o,a,i))return null}return new l("Invalid "+o+" `"+a+"` supplied to `"+r+"`.")}if(!Array.isArray(e))return r.thatReturnsNull;for(var n=0;n<e.length;n++){var o=e[n];if("function"!=typeof o)return a(!1,"Invalid argument supplid to oneOfType. Expected an array of check functions, but received %s at index %s.",E(o),n),r.thatReturnsNull}return c(t)}function m(e){function t(t,n,r,o,a){var u=t[n],s=_(u);if("object"!==s)return new l("Invalid "+o+" `"+a+"` of type `"+s+"` supplied to `"+r+"`, expected `object`.");for(var c in e){var f=e[c];if(f){var p=f(u,c,r,o,a+"."+c,i);if(p)return p}}return null}return c(t)}function g(t){switch(typeof t){case"number":case"string":case"undefined":return!0;case"boolean":return!t;case"object":if(Array.isArray(t))return t.every(g);if(null===t||e(t))return!0;var r=n(t);if(!r)return!1;var o,a=r.call(t);if(r!==t.entries){for(;!(o=a.next()).done;)if(!g(o.value))return!1}else for(;!(o=a.next()).done;){var i=o.value;if(i&&!g(i[1]))return!1}return!0;default:return!1}}function b(e,t){return"symbol"===e||("Symbol"===t["@@toStringTag"]||"function"==typeof Symbol&&t instanceof Symbol)}function _(e){var t=typeof e;return Array.isArray(e)?"array":e instanceof RegExp?"object":b(t,e)?"symbol":t}function w(e){if(void 0===e||null===e)return""+e;var t=_(e);if("object"===t){if(e instanceof Date)return"date";if(e instanceof RegExp)return"regexp"}return t}function E(e){var t=w(e);switch(t){case"array":case"object":return"an "+t;case"boolean":case"date":case"regexp":return"a "+t;default:return t}}function O(e){return e.constructor&&e.constructor.name?e.constructor.name:x}var P="function"==typeof Symbol&&Symbol.iterator,C="@@iterator",x="<<anonymous>>",k={array:f("array"),bool:f("boolean"),func:f("function"),number:f("number"),object:f("object"),string:f("string"),symbol:f("symbol"),any:function(){return c(r.thatReturnsNull)}(),arrayOf:p,element:function(){function t(t,n,r,o,a){var i=t[n];if(!e(i)){return new l("Invalid "+o+" `"+a+"` of type `"+_(i)+"` supplied to `"+r+"`, expected a single ReactElement.")}return null}return c(t)}(),instanceOf:d,node:function(){function e(e,t,n,r,o){return g(e[t])?null:new l("Invalid "+r+" `"+o+"` supplied to `"+n+"`, expected a ReactNode.")}return c(e)}(),objectOf:y,oneOf:h,oneOfType:v,shape:m};return l.prototype=Error.prototype,k.checkPropTypes=u,k.PropTypes=k,k}},function(e,t,n){"use strict";function r(e,t,n,r,o){}e.exports=r},function(e,t,n){"use strict";e.exports="15.6.1"},function(e,t,n){"use strict";var r=n(91),o=r.Component,a=n(25),i=a.isValidElement,u=n(92),s=n(182);e.exports=s(o,i,u)},function(e,t,n){"use strict";function r(e){return e}function o(e,t,n){function o(e,t){var n=g.hasOwnProperty(t)?g[t]:null;E.hasOwnProperty(t)&&u("OVERRIDE_BASE"===n,"ReactClassInterface: You are attempting to override `%s` from your class specification. Ensure that your method names do not overlap with React methods.",t),e&&u("DEFINE_MANY"===n||"DEFINE_MANY_MERGED"===n,"ReactClassInterface: You are attempting to define `%s` on your component more than once. This conflict may be due to a mixin.",t)}function l(e,n){if(n){u("function"!=typeof n,"ReactClass: You're attempting to use a component class or function as a mixin. Instead, just use a regular object."),u(!t(n),"ReactClass: You're attempting to use a component as a mixin. Instead, just use a regular object.");var r=e.prototype,a=r.__reactAutoBindPairs;n.hasOwnProperty(s)&&b.mixins(e,n.mixins);for(var i in n)if(n.hasOwnProperty(i)&&i!==s){var l=n[i],c=r.hasOwnProperty(i);if(o(c,i),b.hasOwnProperty(i))b[i](e,l);else{var f=g.hasOwnProperty(i),h="function"==typeof l,y=h&&!f&&!c&&!1!==n.autobind;if(y)a.push(i,l),r[i]=l;else if(c){var v=g[i];u(f&&("DEFINE_MANY_MERGED"===v||"DEFINE_MANY"===v),"ReactClass: Unexpected spec policy %s for key %s when mixing in component specs.",v,i),"DEFINE_MANY_MERGED"===v?r[i]=p(r[i],l):"DEFINE_MANY"===v&&(r[i]=d(r[i],l))}else r[i]=l}}}else;}function c(e,t){if(t)for(var n in t){var r=t[n];if(t.hasOwnProperty(n)){var o=n in b;u(!o,'ReactClass: You are attempting to define a reserved property, `%s`, that shouldn\'t be on the "statics" key. Define it as an instance property instead; it will still be accessible on the constructor.',n);var a=n in e;u(!a,"ReactClass: You are attempting to define `%s` on your component more than once. This conflict may be due to a mixin.",n),e[n]=r}}}function f(e,t){u(e&&t&&"object"==typeof e&&"object"==typeof t,"mergeIntoWithNoDuplicateKeys(): Cannot merge non-objects.");for(var n in t)t.hasOwnProperty(n)&&(u(void 0===e[n],"mergeIntoWithNoDuplicateKeys(): Tried to merge two objects with the same key: `%s`. This conflict may be due to a mixin; in particular, this may be caused by two getInitialState() or getDefaultProps() methods returning objects with clashing keys.",n),e[n]=t[n]);return e}function p(e,t){return function(){var n=e.apply(this,arguments),r=t.apply(this,arguments);if(null==n)return r;if(null==r)return n;var o={};return f(o,n),f(o,r),o}}function d(e,t){return function(){e.apply(this,arguments),t.apply(this,arguments)}}function h(e,t){var n=t.bind(e);return n}function y(e){for(var t=e.__reactAutoBindPairs,n=0;n<t.length;n+=2){var r=t[n],o=t[n+1];e[r]=h(e,o)}}function v(e){var t=r(function(e,r,o){this.__reactAutoBindPairs.length&&y(this),this.props=e,this.context=r,this.refs=i,this.updater=o||n,this.state=null;var a=this.getInitialState?this.getInitialState():null;u("object"==typeof a&&!Array.isArray(a),"%s.getInitialState(): must return an object or null",t.displayName||"ReactCompositeComponent"),this.state=a});t.prototype=new O,t.prototype.constructor=t,t.prototype.__reactAutoBindPairs=[],m.forEach(l.bind(null,t)),l(t,_),l(t,e),l(t,w),t.getDefaultProps&&(t.defaultProps=t.getDefaultProps()),u(t.prototype.render,"createClass(...): Class specification must implement a `render` method.");for(var o in g)t.prototype[o]||(t.prototype[o]=null);return t}var m=[],g={mixins:"DEFINE_MANY",statics:"DEFINE_MANY",propTypes:"DEFINE_MANY",contextTypes:"DEFINE_MANY",childContextTypes:"DEFINE_MANY",getDefaultProps:"DEFINE_MANY_MERGED",getInitialState:"DEFINE_MANY_MERGED",getChildContext:"DEFINE_MANY_MERGED",render:"DEFINE_ONCE",componentWillMount:"DEFINE_MANY",componentDidMount:"DEFINE_MANY",componentWillReceiveProps:"DEFINE_MANY",shouldComponentUpdate:"DEFINE_ONCE",componentWillUpdate:"DEFINE_MANY",componentDidUpdate:"DEFINE_MANY",componentWillUnmount:"DEFINE_MANY",updateComponent:"OVERRIDE_BASE"},b={displayName:function(e,t){e.displayName=t},mixins:function(e,t){if(t)for(var n=0;n<t.length;n++)l(e,t[n])},childContextTypes:function(e,t){e.childContextTypes=a({},e.childContextTypes,t)},contextTypes:function(e,t){e.contextTypes=a({},e.contextTypes,t)},getDefaultProps:function(e,t){e.getDefaultProps?e.getDefaultProps=p(e.getDefaultProps,t):e.getDefaultProps=t},propTypes:function(e,t){e.propTypes=a({},e.propTypes,t)},statics:function(e,t){c(e,t)},autobind:function(){}},_={componentDidMount:function(){this.__isMounted=!0}},w={componentWillUnmount:function(){this.__isMounted=!1}},E={replaceState:function(e,t){this.updater.enqueueReplaceState(this,e,t)},isMounted:function(){return!!this.__isMounted}},O=function(){};return a(O.prototype,e.prototype,E),v}var a=n(4),i=n(41),u=n(1),s="mixins";e.exports=o},function(e,t,n){"use strict";function r(e){return a.isValidElement(e)||o("143"),e}var o=n(31),a=n(25);n(1);e.exports=r},function(e,t,n){"use strict";var r=n(6),o=n(185),a=n(122),i=n(27),u=n(14),s=n(257),l=n(258),c=n(123),f=n(259);n(2);o.inject();var p={findDOMNode:l,render:a.render,unmountComponentAtNode:a.unmountComponentAtNode,version:s,unstable_batchedUpdates:u.batchedUpdates,unstable_renderSubtreeIntoContainer:f};"undefined"!=typeof __REACT_DEVTOOLS_GLOBAL_HOOK__&&"function"==typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.inject&&__REACT_DEVTOOLS_GLOBAL_HOOK__.inject({ComponentTree:{getClosestInstanceFromNode:r.getClosestInstanceFromNode,getNodeFromInstance:function(e){return e._renderedComponent&&(e=c(e)),e?r.getNodeFromInstance(e):null}},Mount:a,Reconciler:i});e.exports=p},function(e,t,n){"use strict";function r(){O||(O=!0,g.EventEmitter.injectReactEventListener(m),g.EventPluginHub.injectEventPluginOrder(u),g.EventPluginUtils.injectComponentTree(p),g.EventPluginUtils.injectTreeTraversal(h),g.EventPluginHub.injectEventPluginsByName({SimpleEventPlugin:E,EnterLeaveEventPlugin:s,ChangeEventPlugin:i,SelectEventPlugin:w,BeforeInputEventPlugin:a}),g.HostComponent.injectGenericComponentClass(f),g.HostComponent.injectTextComponentClass(y),g.DOMProperty.injectDOMPropertyConfig(o),g.DOMProperty.injectDOMPropertyConfig(l),g.DOMProperty.injectDOMPropertyConfig(_),g.EmptyComponent.injectEmptyComponentFactory(function(e){return new d(e)}),g.Updates.injectReconcileTransaction(b),g.Updates.injectBatchingStrategy(v),g.Component.injectEnvironment(c))}var o=n(186),a=n(187),i=n(191),u=n(194),s=n(195),l=n(196),c=n(197),f=n(203),p=n(6),d=n(228),h=n(229),y=n(230),v=n(231),m=n(232),g=n(234),b=n(235),_=n(241),w=n(242),E=n(243),O=!1;e.exports={inject:r}},function(e,t,n){"use strict";var r={Properties:{"aria-current":0,"aria-details":0,"aria-disabled":0,"aria-hidden":0,"aria-invalid":0,"aria-keyshortcuts":0,"aria-label":0,"aria-roledescription":0,"aria-autocomplete":0,"aria-checked":0,"aria-expanded":0,"aria-haspopup":0,"aria-level":0,"aria-modal":0,"aria-multiline":0,"aria-multiselectable":0,"aria-orientation":0,"aria-placeholder":0,"aria-pressed":0,"aria-readonly":0,"aria-required":0,"aria-selected":0,"aria-sort":0,"aria-valuemax":0,"aria-valuemin":0,"aria-valuenow":0,"aria-valuetext":0,"aria-atomic":0,"aria-busy":0,"aria-live":0,"aria-relevant":0,"aria-dropeffect":0,"aria-grabbed":0,"aria-activedescendant":0,"aria-colcount":0,"aria-colindex":0,"aria-colspan":0,"aria-controls":0,"aria-describedby":0,"aria-errormessage":0,"aria-flowto":0,"aria-labelledby":0,"aria-owns":0,"aria-posinset":0,"aria-rowcount":0,"aria-rowindex":0,"aria-rowspan":0,"aria-setsize":0},DOMAttributeNames:{},DOMPropertyNames:{}};e.exports=r},function(e,t,n){"use strict";function r(e){return(e.ctrlKey||e.altKey||e.metaKey)&&!(e.ctrlKey&&e.altKey)}function o(e){switch(e){case"topCompositionStart":return C.compositionStart;case"topCompositionEnd":return C.compositionEnd;case"topCompositionUpdate":return C.compositionUpdate}}function a(e,t){return"topKeyDown"===e&&t.keyCode===g}function i(e,t){switch(e){case"topKeyUp":return-1!==m.indexOf(t.keyCode);case"topKeyDown":return t.keyCode!==g;case"topKeyPress":case"topMouseDown":case"topBlur":return!0;default:return!1}}function u(e){var t=e.detail;return"object"==typeof t&&"data"in t?t.data:null}function s(e,t,n,r){var s,l;if(b?s=o(e):k?i(e,n)&&(s=C.compositionEnd):a(e,n)&&(s=C.compositionStart),!s)return null;E&&(k||s!==C.compositionStart?s===C.compositionEnd&&k&&(l=k.getData()):k=h.getPooled(r));var c=y.getPooled(s,t,n,r);if(l)c.data=l;else{var f=u(n);null!==f&&(c.data=f)}return p.accumulateTwoPhaseDispatches(c),c}function l(e,t){switch(e){case"topCompositionEnd":return u(t);case"topKeyPress":return t.which!==O?null:(x=!0,P);case"topTextInput":var n=t.data;return n===P&&x?null:n;default:return null}}function c(e,t){if(k){if("topCompositionEnd"===e||!b&&i(e,t)){var n=k.getData();return h.release(k),k=null,n}return null}switch(e){case"topPaste":return null;case"topKeyPress":return t.which&&!r(t)?String.fromCharCode(t.which):null;case"topCompositionEnd":return E?null:t.data;default:return null}}function f(e,t,n,r){var o;if(!(o=w?l(e,n):c(e,n)))return null;var a=v.getPooled(C.beforeInput,t,n,r);return a.data=o,p.accumulateTwoPhaseDispatches(a),a}var p=n(32),d=n(9),h=n(188),y=n(189),v=n(190),m=[9,13,27,32],g=229,b=d.canUseDOM&&"CompositionEvent"in window,_=null;d.canUseDOM&&"documentMode"in document&&(_=document.documentMode);var w=d.canUseDOM&&"TextEvent"in window&&!_&&!function(){var e=window.opera;return"object"==typeof e&&"function"==typeof e.version&&parseInt(e.version(),10)<=12}(),E=d.canUseDOM&&(!b||_&&_>8&&_<=11),O=32,P=String.fromCharCode(O),C={beforeInput:{phasedRegistrationNames:{bubbled:"onBeforeInput",captured:"onBeforeInputCapture"},dependencies:["topCompositionEnd","topKeyPress","topTextInput","topPaste"]},compositionEnd:{phasedRegistrationNames:{bubbled:"onCompositionEnd",captured:"onCompositionEndCapture"},dependencies:["topBlur","topCompositionEnd","topKeyDown","topKeyPress","topKeyUp","topMouseDown"]},compositionStart:{phasedRegistrationNames:{bubbled:"onCompositionStart",captured:"onCompositionStartCapture"},dependencies:["topBlur","topCompositionStart","topKeyDown","topKeyPress","topKeyUp","topMouseDown"]},compositionUpdate:{phasedRegistrationNames:{bubbled:"onCompositionUpdate",captured:"onCompositionUpdateCapture"},dependencies:["topBlur","topCompositionUpdate","topKeyDown","topKeyPress","topKeyUp","topMouseDown"]}},x=!1,k=null,S={eventTypes:C,extractEvents:function(e,t,n,r){return[s(e,t,n,r),f(e,t,n,r)]}};e.exports=S},function(e,t,n){"use strict";function r(e){this._root=e,this._startText=this.getText(),this._fallbackText=null}var o=n(4),a=n(22),i=n(101);o(r.prototype,{destructor:function(){this._root=null,this._startText=null,this._fallbackText=null},getText:function(){return"value"in this._root?this._root.value:this._root[i()]},getData:function(){if(this._fallbackText)return this._fallbackText;var e,t,n=this._startText,r=n.length,o=this.getText(),a=o.length;for(e=0;e<r&&n[e]===o[e];e++);var i=r-e;for(t=1;t<=i&&n[r-t]===o[a-t];t++);var u=t>1?1-t:void 0;return this._fallbackText=o.slice(e,u),this._fallbackText}}),a.addPoolingTo(r),e.exports=r},function(e,t,n){"use strict";function r(e,t,n,r){return o.call(this,e,t,n,r)}var o=n(18),a={data:null};o.augmentClass(r,a),e.exports=r},function(e,t,n){"use strict";function r(e,t,n,r){return o.call(this,e,t,n,r)}var o=n(18),a={data:null};o.augmentClass(r,a),e.exports=r},function(e,t,n){"use strict";function r(e,t,n){var r=x.getPooled(R.change,e,t,n);return r.type="change",E.accumulateTwoPhaseDispatches(r),r}function o(e){var t=e.nodeName&&e.nodeName.toLowerCase();return"select"===t||"input"===t&&"file"===e.type}function a(e){var t=r(M,e,S(e));C.batchedUpdates(i,t)}function i(e){w.enqueueEvents(e),w.processEventQueue(!1)}function u(e,t){N=e,M=t,N.attachEvent("onchange",a)}function s(){N&&(N.detachEvent("onchange",a),N=null,M=null)}function l(e,t){var n=k.updateValueIfChanged(e),r=!0===t.simulated&&D._allowSimulatedPassThrough;if(n||r)return e}function c(e,t){if("topChange"===e)return t}function f(e,t,n){"topFocus"===e?(s(),u(t,n)):"topBlur"===e&&s()}function p(e,t){N=e,M=t,N.attachEvent("onpropertychange",h)}function d(){N&&(N.detachEvent("onpropertychange",h),N=null,M=null)}function h(e){"value"===e.propertyName&&l(M,e)&&a(e)}function y(e,t,n){"topFocus"===e?(d(),p(t,n)):"topBlur"===e&&d()}function v(e,t,n){if("topSelectionChange"===e||"topKeyUp"===e||"topKeyDown"===e)return l(M,n)}function m(e){var t=e.nodeName;return t&&"input"===t.toLowerCase()&&("checkbox"===e.type||"radio"===e.type)}function g(e,t,n){if("topClick"===e)return l(t,n)}function b(e,t,n){if("topInput"===e||"topChange"===e)return l(t,n)}function _(e,t){if(null!=e){var n=e._wrapperState||t._wrapperState;if(n&&n.controlled&&"number"===t.type){var r=""+t.value;t.getAttribute("value")!==r&&t.setAttribute("value",r)}}}var w=n(33),E=n(32),O=n(9),P=n(6),C=n(14),x=n(18),k=n(104),S=n(61),T=n(62),j=n(105),R={change:{phasedRegistrationNames:{bubbled:"onChange",captured:"onChangeCapture"},dependencies:["topBlur","topChange","topClick","topFocus","topInput","topKeyDown","topKeyUp","topSelectionChange"]}},N=null,M=null,I=!1;O.canUseDOM&&(I=T("change")&&(!document.documentMode||document.documentMode>8));var A=!1;O.canUseDOM&&(A=T("input")&&(!("documentMode"in document)||document.documentMode>9));var D={eventTypes:R,_allowSimulatedPassThrough:!0,_isInputEventSupported:A,extractEvents:function(e,t,n,a){var i,u,s=t?P.getNodeFromInstance(t):window;if(o(s)?I?i=c:u=f:j(s)?A?i=b:(i=v,u=y):m(s)&&(i=g),i){var l=i(e,t,n);if(l){return r(l,n,a)}}u&&u(e,s,t),"topBlur"===e&&_(t,s)}};e.exports=D},function(e,t,n){"use strict";function r(e,t,n){"function"==typeof e?e(t.getPublicInstance()):a.addComponentAsRefTo(t,e,n)}function o(e,t,n){"function"==typeof e?e(null):a.removeComponentAsRefFrom(t,e,n)}var a=n(193),i={};i.attachRefs=function(e,t){if(null!==t&&"object"==typeof t){var n=t.ref;null!=n&&r(n,e,t._owner)}},i.shouldUpdateRefs=function(e,t){var n=null,r=null;null!==e&&"object"==typeof e&&(n=e.ref,r=e._owner);var o=null,a=null;return null!==t&&"object"==typeof t&&(o=t.ref,a=t._owner),n!==o||"string"==typeof o&&a!==r},i.detachRefs=function(e,t){if(null!==t&&"object"==typeof t){var n=t.ref;null!=n&&o(n,e,t._owner)}},e.exports=i},function(e,t,n){"use strict";function r(e){return!(!e||"function"!=typeof e.attachRef||"function"!=typeof e.detachRef)}var o=n(3),a=(n(1),{addComponentAsRefTo:function(e,t,n){r(n)||o("119"),n.attachRef(t,e)},removeComponentAsRefFrom:function(e,t,n){r(n)||o("120");var a=n.getPublicInstance();a&&a.refs[t]===e.getPublicInstance()&&n.detachRef(t)}});e.exports=a},function(e,t,n){"use strict";var r=["ResponderEventPlugin","SimpleEventPlugin","TapEventPlugin","EnterLeaveEventPlugin","ChangeEventPlugin","SelectEventPlugin","BeforeInputEventPlugin"];e.exports=r},function(e,t,n){"use strict";var r=n(32),o=n(6),a=n(43),i={mouseEnter:{registrationName:"onMouseEnter",dependencies:["topMouseOut","topMouseOver"]},mouseLeave:{registrationName:"onMouseLeave",dependencies:["topMouseOut","topMouseOver"]}},u={eventTypes:i,extractEvents:function(e,t,n,u){if("topMouseOver"===e&&(n.relatedTarget||n.fromElement))return null;if("topMouseOut"!==e&&"topMouseOver"!==e)return null;var s;if(u.window===u)s=u;else{var l=u.ownerDocument;s=l?l.defaultView||l.parentWindow:window}var c,f;if("topMouseOut"===e){c=t;var p=n.relatedTarget||n.toElement;f=p?o.getClosestInstanceFromNode(p):null}else c=null,f=t;if(c===f)return null;var d=null==c?s:o.getNodeFromInstance(c),h=null==f?s:o.getNodeFromInstance(f),y=a.getPooled(i.mouseLeave,c,n,u);y.type="mouseleave",y.target=d,y.relatedTarget=h;var v=a.getPooled(i.mouseEnter,f,n,u);return v.type="mouseenter",v.target=h,v.relatedTarget=d,r.accumulateEnterLeaveDispatches(y,v,c,f),[y,v]}};e.exports=u},function(e,t,n){"use strict";var r=n(26),o=r.injection.MUST_USE_PROPERTY,a=r.injection.HAS_BOOLEAN_VALUE,i=r.injection.HAS_NUMERIC_VALUE,u=r.injection.HAS_POSITIVE_NUMERIC_VALUE,s=r.injection.HAS_OVERLOADED_BOOLEAN_VALUE,l={isCustomAttribute:RegExp.prototype.test.bind(new RegExp("^(data|aria)-["+r.ATTRIBUTE_NAME_CHAR+"]*$")),Properties:{accept:0,acceptCharset:0,accessKey:0,action:0,allowFullScreen:a,allowTransparency:0,alt:0,as:0,async:a,autoComplete:0,autoPlay:a,capture:a,cellPadding:0,cellSpacing:0,charSet:0,challenge:0,checked:o|a,cite:0,classID:0,className:0,cols:u,colSpan:0,content:0,contentEditable:0,contextMenu:0,controls:a,coords:0,crossOrigin:0,data:0,dateTime:0,default:a,defer:a,dir:0,disabled:a,download:s,draggable:0,encType:0,form:0,formAction:0,formEncType:0,formMethod:0,formNoValidate:a,formTarget:0,frameBorder:0,headers:0,height:0,hidden:a,high:0,href:0,hrefLang:0,htmlFor:0,httpEquiv:0,icon:0,id:0,inputMode:0,integrity:0,is:0,keyParams:0,keyType:0,kind:0,label:0,lang:0,list:0,loop:a,low:0,manifest:0,marginHeight:0,marginWidth:0,max:0,maxLength:0,media:0,mediaGroup:0,method:0,min:0,minLength:0,multiple:o|a,muted:o|a,name:0,nonce:0,noValidate:a,open:a,optimum:0,pattern:0,placeholder:0,playsInline:a,poster:0,preload:0,profile:0,radioGroup:0,readOnly:a,referrerPolicy:0,rel:0,required:a,reversed:a,role:0,rows:u,rowSpan:i,sandbox:0,scope:0,scoped:a,scrolling:0,seamless:a,selected:o|a,shape:0,size:u,sizes:0,span:u,spellCheck:0,src:0,srcDoc:0,srcLang:0,srcSet:0,start:i,step:0,style:0,summary:0,tabIndex:0,target:0,title:0,type:0,useMap:0,value:0,width:0,wmode:0,wrap:0,about:0,datatype:0,inlist:0,prefix:0,property:0,resource:0,typeof:0,vocab:0,autoCapitalize:0,autoCorrect:0,autoSave:0,color:0,itemProp:0,itemScope:a,itemType:0,itemID:0,itemRef:0,results:0,security:0,unselectable:0},DOMAttributeNames:{acceptCharset:"accept-charset",className:"class",htmlFor:"for",httpEquiv:"http-equiv"},DOMPropertyNames:{},DOMMutationMethods:{value:function(e,t){if(null==t)return e.removeAttribute("value");"number"!==e.type||!1===e.hasAttribute("value")?e.setAttribute("value",""+t):e.validity&&!e.validity.badInput&&e.ownerDocument.activeElement!==e&&e.setAttribute("value",""+t)}}};e.exports=l},function(e,t,n){"use strict";var r=n(64),o=n(202),a={processChildrenUpdates:o.dangerouslyProcessChildrenUpdates,replaceNodeWithMarkup:r.dangerouslyReplaceNodeWithMarkup};e.exports=a},function(e,t,n){"use strict";var r=n(3),o=n(28),a=n(9),i=n(199),u=n(11),s=(n(1),{dangerouslyReplaceNodeWithMarkup:function(e,t){if(a.canUseDOM||r("56"),t||r("57"),"HTML"===e.nodeName&&r("58"),"string"==typeof t){var n=i(t,u)[0];e.parentNode.replaceChild(n,e)}else o.replaceChildWithTree(e,t)}});e.exports=s},function(e,t,n){"use strict";function r(e){var t=e.match(c);return t&&t[1].toLowerCase()}function o(e,t){var n=l;l||s(!1);var o=r(e),a=o&&u(o);if(a){n.innerHTML=a[1]+e+a[2];for(var c=a[0];c--;)n=n.lastChild}else n.innerHTML=e;var f=n.getElementsByTagName("script");f.length&&(t||s(!1),i(f).forEach(t));for(var p=Array.from(n.childNodes);n.lastChild;)n.removeChild(n.lastChild);return p}var a=n(9),i=n(200),u=n(201),s=n(1),l=a.canUseDOM?document.createElement("div"):null,c=/^\s*<(\w+)/;e.exports=o},function(e,t,n){"use strict";function r(e){var t=e.length;if((Array.isArray(e)||"object"!=typeof e&&"function"!=typeof e)&&i(!1),"number"!=typeof t&&i(!1),0===t||t-1 in e||i(!1),"function"==typeof e.callee&&i(!1),e.hasOwnProperty)try{return Array.prototype.slice.call(e)}catch(e){}for(var n=Array(t),r=0;r<t;r++)n[r]=e[r];return n}function o(e){return!!e&&("object"==typeof e||"function"==typeof e)&&"length"in e&&!("setInterval"in e)&&"number"!=typeof e.nodeType&&(Array.isArray(e)||"callee"in e||"item"in e)}function a(e){return o(e)?Array.isArray(e)?e.slice():r(e):[e]}var i=n(1);e.exports=a},function(e,t,n){"use strict";function r(e){return i||a(!1),p.hasOwnProperty(e)||(e="*"),u.hasOwnProperty(e)||(i.innerHTML="*"===e?"<link />":"<"+e+"></"+e+">",u[e]=!i.firstChild),u[e]?p[e]:null}var o=n(9),a=n(1),i=o.canUseDOM?document.createElement("div"):null,u={},s=[1,'<select multiple="true">',"</select>"],l=[1,"<table>","</table>"],c=[3,"<table><tbody><tr>","</tr></tbody></table>"],f=[1,'<svg xmlns="http://www.w3.org/2000/svg">',"</svg>"],p={"*":[1,"?<div>","</div>"],area:[1,"<map>","</map>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],legend:[1,"<fieldset>","</fieldset>"],param:[1,"<object>","</object>"],tr:[2,"<table><tbody>","</tbody></table>"],optgroup:s,option:s,caption:l,colgroup:l,tbody:l,tfoot:l,thead:l,td:c,th:c};["circle","clipPath","defs","ellipse","g","image","line","linearGradient","mask","path","pattern","polygon","polyline","radialGradient","rect","stop","text","tspan"].forEach(function(e){p[e]=f,u[e]=!0}),e.exports=r},function(e,t,n){"use strict";var r=n(64),o=n(6),a={dangerouslyProcessChildrenUpdates:function(e,t){var n=o.getNodeFromInstance(e);r.processUpdates(n,t)}};e.exports=a},function(e,t,n){"use strict";function r(e){if(e){var t=e._currentElement._owner||null;if(t){var n=t.getName();if(n)return" This DOM node was rendered by `"+n+"`."}}return""}function o(e,t){t&&(G[e._tag]&&(null!=t.children||null!=t.dangerouslySetInnerHTML)&&v("137",e._tag,e._currentElement._owner?" Check the render method of "+e._currentElement._owner.getName()+".":""),null!=t.dangerouslySetInnerHTML&&(null!=t.children&&v("60"),"object"==typeof t.dangerouslySetInnerHTML&&q in t.dangerouslySetInnerHTML||v("61")),null!=t.style&&"object"!=typeof t.style&&v("62",r(e)))}function a(e,t,n,r){if(!(r instanceof I)){var o=e._hostContainerInfo,a=o._node&&o._node.nodeType===z,u=a?o._node:o._ownerDocument;V(t,u),r.getReactMountReady().enqueue(i,{inst:e,registrationName:t,listener:n})}}function i(){var e=this;P.putListener(e.inst,e.registrationName,e.listener)}function u(){var e=this;T.postMountWrapper(e)}function s(){var e=this;N.postMountWrapper(e)}function l(){var e=this;j.postMountWrapper(e)}function c(){D.track(this)}function f(){var e=this;e._rootNodeID||v("63");var t=F(e);switch(t||v("64"),e._tag){case"iframe":case"object":e._wrapperState.listeners=[x.trapBubbledEvent("topLoad","load",t)];break;case"video":case"audio":e._wrapperState.listeners=[];for(var n in Y)Y.hasOwnProperty(n)&&e._wrapperState.listeners.push(x.trapBubbledEvent(n,Y[n],t));break;case"source":e._wrapperState.listeners=[x.trapBubbledEvent("topError","error",t)];break;case"img":e._wrapperState.listeners=[x.trapBubbledEvent("topError","error",t),x.trapBubbledEvent("topLoad","load",t)];break;case"form":e._wrapperState.listeners=[x.trapBubbledEvent("topReset","reset",t),x.trapBubbledEvent("topSubmit","submit",t)];break;case"input":case"select":case"textarea":e._wrapperState.listeners=[x.trapBubbledEvent("topInvalid","invalid",t)]}}function p(){R.postUpdateWrapper(this)}function d(e){J.call(Q,e)||(X.test(e)||v("65",e),Q[e]=!0)}function h(e,t){return e.indexOf("-")>=0||null!=t.is}function y(e){var t=e.type;d(t),this._currentElement=e,this._tag=t.toLowerCase(),this._namespaceURI=null,this._renderedChildren=null,this._previousStyle=null,this._previousStyleCopy=null,this._hostNode=null,this._hostParent=null,this._rootNodeID=0,this._domID=0,this._hostContainerInfo=null,this._wrapperState=null,this._topLevelWrapper=null,this._flags=0}var v=n(3),m=n(4),g=n(204),b=n(205),_=n(28),w=n(65),E=n(26),O=n(110),P=n(33),C=n(58),x=n(46),k=n(98),S=n(6),T=n(215),j=n(217),R=n(111),N=n(218),M=(n(13),n(219)),I=n(226),A=(n(11),n(45)),D=(n(1),n(62),n(69),n(104)),L=(n(73),n(2),k),U=P.deleteListener,F=S.getNodeFromInstance,V=x.listenTo,W=C.registrationNameModules,B={string:!0,number:!0},q="__html",H={children:null,dangerouslySetInnerHTML:null,suppressContentEditableWarning:null},z=11,Y={topAbort:"abort",topCanPlay:"canplay",topCanPlayThrough:"canplaythrough",topDurationChange:"durationchange",topEmptied:"emptied",topEncrypted:"encrypted",topEnded:"ended",topError:"error",topLoadedData:"loadeddata",topLoadedMetadata:"loadedmetadata",topLoadStart:"loadstart",topPause:"pause",topPlay:"play",topPlaying:"playing",topProgress:"progress",topRateChange:"ratechange",topSeeked:"seeked",topSeeking:"seeking",topStalled:"stalled",topSuspend:"suspend",topTimeUpdate:"timeupdate",topVolumeChange:"volumechange",topWaiting:"waiting"},K={area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0},$={listing:!0,pre:!0,textarea:!0},G=m({menuitem:!0},K),X=/^[a-zA-Z][a-zA-Z:_\.\-\d]*$/,Q={},J={}.hasOwnProperty,Z=1;y.displayName="ReactDOMComponent",y.Mixin={mountComponent:function(e,t,n,r){this._rootNodeID=Z++,this._domID=n._idCounter++,this._hostParent=t,this._hostContainerInfo=n;var a=this._currentElement.props;switch(this._tag){case"audio":case"form":case"iframe":case"img":case"link":case"object":case"source":case"video":this._wrapperState={listeners:null},e.getReactMountReady().enqueue(f,this);break;case"input":T.mountWrapper(this,a,t),a=T.getHostProps(this,a),e.getReactMountReady().enqueue(c,this),e.getReactMountReady().enqueue(f,this);break;case"option":j.mountWrapper(this,a,t),a=j.getHostProps(this,a);break;case"select":R.mountWrapper(this,a,t),a=R.getHostProps(this,a),e.getReactMountReady().enqueue(f,this);break;case"textarea":N.mountWrapper(this,a,t),a=N.getHostProps(this,a),e.getReactMountReady().enqueue(c,this),e.getReactMountReady().enqueue(f,this)}o(this,a);var i,p;null!=t?(i=t._namespaceURI,p=t._tag):n._tag&&(i=n._namespaceURI,p=n._tag),(null==i||i===w.svg&&"foreignobject"===p)&&(i=w.html),i===w.html&&("svg"===this._tag?i=w.svg:"math"===this._tag&&(i=w.mathml)),this._namespaceURI=i;var d;if(e.useCreateElement){var h,y=n._ownerDocument;if(i===w.html)if("script"===this._tag){var v=y.createElement("div"),m=this._currentElement.type;v.innerHTML="<"+m+"></"+m+">",h=v.removeChild(v.firstChild)}else h=a.is?y.createElement(this._currentElement.type,a.is):y.createElement(this._currentElement.type);else h=y.createElementNS(i,this._currentElement.type);S.precacheNode(this,h),this._flags|=L.hasCachedChildNodes,this._hostParent||O.setAttributeForRoot(h),this._updateDOMProperties(null,a,e);var b=_(h);this._createInitialChildren(e,a,r,b),d=b}else{var E=this._createOpenTagMarkupAndPutListeners(e,a),P=this._createContentMarkup(e,a,r);d=!P&&K[this._tag]?E+"/>":E+">"+P+"</"+this._currentElement.type+">"}switch(this._tag){case"input":e.getReactMountReady().enqueue(u,this),a.autoFocus&&e.getReactMountReady().enqueue(g.focusDOMComponent,this);break;case"textarea":e.getReactMountReady().enqueue(s,this),a.autoFocus&&e.getReactMountReady().enqueue(g.focusDOMComponent,this);break;case"select":case"button":a.autoFocus&&e.getReactMountReady().enqueue(g.focusDOMComponent,this);break;case"option":e.getReactMountReady().enqueue(l,this)}return d},_createOpenTagMarkupAndPutListeners:function(e,t){var n="<"+this._currentElement.type;for(var r in t)if(t.hasOwnProperty(r)){var o=t[r];if(null!=o)if(W.hasOwnProperty(r))o&&a(this,r,o,e);else{"style"===r&&(o&&(o=this._previousStyleCopy=m({},t.style)),o=b.createMarkupForStyles(o,this));var i=null;null!=this._tag&&h(this._tag,t)?H.hasOwnProperty(r)||(i=O.createMarkupForCustomAttribute(r,o)):i=O.createMarkupForProperty(r,o),i&&(n+=" "+i)}}return e.renderToStaticMarkup?n:(this._hostParent||(n+=" "+O.createMarkupForRoot()),n+=" "+O.createMarkupForID(this._domID))},_createContentMarkup:function(e,t,n){var r="",o=t.dangerouslySetInnerHTML;if(null!=o)null!=o.__html&&(r=o.__html);else{var a=B[typeof t.children]?t.children:null,i=null!=a?null:t.children;if(null!=a)r=A(a);else if(null!=i){var u=this.mountChildren(i,e,n);r=u.join("")}}return $[this._tag]&&"\n"===r.charAt(0)?"\n"+r:r},_createInitialChildren:function(e,t,n,r){var o=t.dangerouslySetInnerHTML;if(null!=o)null!=o.__html&&_.queueHTML(r,o.__html);else{var a=B[typeof t.children]?t.children:null,i=null!=a?null:t.children;if(null!=a)""!==a&&_.queueText(r,a);else if(null!=i)for(var u=this.mountChildren(i,e,n),s=0;s<u.length;s++)_.queueChild(r,u[s])}},receiveComponent:function(e,t,n){var r=this._currentElement;this._currentElement=e,this.updateComponent(t,r,e,n)},updateComponent:function(e,t,n,r){var a=t.props,i=this._currentElement.props;switch(this._tag){case"input":a=T.getHostProps(this,a),i=T.getHostProps(this,i);break;case"option":a=j.getHostProps(this,a),i=j.getHostProps(this,i);break;case"select":a=R.getHostProps(this,a),i=R.getHostProps(this,i);break;case"textarea":a=N.getHostProps(this,a),i=N.getHostProps(this,i)}switch(o(this,i),this._updateDOMProperties(a,i,e),this._updateDOMChildren(a,i,e,r),this._tag){case"input":T.updateWrapper(this);break;case"textarea":N.updateWrapper(this);break;case"select":e.getReactMountReady().enqueue(p,this)}},_updateDOMProperties:function(e,t,n){var r,o,i;for(r in e)if(!t.hasOwnProperty(r)&&e.hasOwnProperty(r)&&null!=e[r])if("style"===r){var u=this._previousStyleCopy;for(o in u)u.hasOwnProperty(o)&&(i=i||{},i[o]="");this._previousStyleCopy=null}else W.hasOwnProperty(r)?e[r]&&U(this,r):h(this._tag,e)?H.hasOwnProperty(r)||O.deleteValueForAttribute(F(this),r):(E.properties[r]||E.isCustomAttribute(r))&&O.deleteValueForProperty(F(this),r);for(r in t){var s=t[r],l="style"===r?this._previousStyleCopy:null!=e?e[r]:void 0;if(t.hasOwnProperty(r)&&s!==l&&(null!=s||null!=l))if("style"===r)if(s?s=this._previousStyleCopy=m({},s):this._previousStyleCopy=null,l){for(o in l)!l.hasOwnProperty(o)||s&&s.hasOwnProperty(o)||(i=i||{},i[o]="");for(o in s)s.hasOwnProperty(o)&&l[o]!==s[o]&&(i=i||{},i[o]=s[o])}else i=s;else if(W.hasOwnProperty(r))s?a(this,r,s,n):l&&U(this,r);else if(h(this._tag,t))H.hasOwnProperty(r)||O.setValueForAttribute(F(this),r,s);else if(E.properties[r]||E.isCustomAttribute(r)){var c=F(this);null!=s?O.setValueForProperty(c,r,s):O.deleteValueForProperty(c,r)}}i&&b.setValueForStyles(F(this),i,this)},_updateDOMChildren:function(e,t,n,r){var o=B[typeof e.children]?e.children:null,a=B[typeof t.children]?t.children:null,i=e.dangerouslySetInnerHTML&&e.dangerouslySetInnerHTML.__html,u=t.dangerouslySetInnerHTML&&t.dangerouslySetInnerHTML.__html,s=null!=o?null:e.children,l=null!=a?null:t.children,c=null!=o||null!=i,f=null!=a||null!=u;null!=s&&null==l?this.updateChildren(null,n,r):c&&!f&&this.updateTextContent(""),null!=a?o!==a&&this.updateTextContent(""+a):null!=u?i!==u&&this.updateMarkup(""+u):null!=l&&this.updateChildren(l,n,r)},getHostNode:function(){return F(this)},unmountComponent:function(e){switch(this._tag){case"audio":case"form":case"iframe":case"img":case"link":case"object":case"source":case"video":var t=this._wrapperState.listeners;if(t)for(var n=0;n<t.length;n++)t[n].remove();break;case"input":case"textarea":D.stopTracking(this);break;case"html":case"head":case"body":v("66",this._tag)}this.unmountChildren(e),S.uncacheNode(this),P.deleteAllListeners(this),this._rootNodeID=0,this._domID=0,this._wrapperState=null},getPublicInstance:function(){return F(this)}},m(y.prototype,y.Mixin,M.Mixin),e.exports=y},function(e,t,n){"use strict";var r=n(6),o=n(108),a={focusDOMComponent:function(){o(r.getNodeFromInstance(this))}};e.exports=a},function(e,t,n){"use strict";var r=n(109),o=n(9),a=(n(13),n(206),n(208)),i=n(209),u=n(211),s=(n(2),u(function(e){return i(e)})),l=!1,c="cssFloat";if(o.canUseDOM){var f=document.createElement("div").style;try{f.font=""}catch(e){l=!0}void 0===document.documentElement.style.cssFloat&&(c="styleFloat")}var p={createMarkupForStyles:function(e,t){var n="";for(var r in e)if(e.hasOwnProperty(r)){var o=0===r.indexOf("--"),i=e[r];null!=i&&(n+=s(r)+":",n+=a(r,i,t,o)+";")}return n||null},setValueForStyles:function(e,t,n){var o=e.style;for(var i in t)if(t.hasOwnProperty(i)){var u=0===i.indexOf("--"),s=a(i,t[i],n,u);if("float"!==i&&"cssFloat"!==i||(i=c),u)o.setProperty(i,s);else if(s)o[i]=s;else{var f=l&&r.shorthandPropertyExpansions[i];if(f)for(var p in f)o[p]="";else o[i]=""}}}};e.exports=p},function(e,t,n){"use strict";function r(e){return o(e.replace(a,"ms-"))}var o=n(207),a=/^-ms-/;e.exports=r},function(e,t,n){"use strict";function r(e){return e.replace(o,function(e,t){return t.toUpperCase()})}var o=/-(.)/g;e.exports=r},function(e,t,n){"use strict";function r(e,t,n,r){if(null==t||"boolean"==typeof t||""===t)return"";var o=isNaN(t);if(r||o||0===t||a.hasOwnProperty(e)&&a[e])return""+t;if("string"==typeof t){t=t.trim()}return t+"px"}var o=n(109),a=(n(2),o.isUnitlessNumber);e.exports=r},function(e,t,n){"use strict";function r(e){return o(e).replace(a,"-ms-")}var o=n(210),a=/^ms-/;e.exports=r},function(e,t,n){"use strict";function r(e){return e.replace(o,"-$1").toLowerCase()}var o=/([A-Z])/g;e.exports=r},function(e,t,n){"use strict";function r(e){var t={};return function(n){return t.hasOwnProperty(n)||(t[n]=e.call(this,n)),t[n]}}e.exports=r},function(e,t,n){"use strict";function r(e){return'"'+o(e)+'"'}var o=n(45);e.exports=r},function(e,t,n){"use strict";function r(e){o.enqueueEvents(e),o.processEventQueue(!1)}var o=n(33),a={handleTopLevel:function(e,t,n,a){r(o.extractEvents(e,t,n,a))}};e.exports=a},function(e,t,n){"use strict";function r(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n["Webkit"+e]="webkit"+t,n["Moz"+e]="moz"+t,n["ms"+e]="MS"+t,n["O"+e]="o"+t.toLowerCase(),n}function o(e){if(u[e])return u[e];if(!i[e])return e;var t=i[e];for(var n in t)if(t.hasOwnProperty(n)&&n in s)return u[e]=t[n];return""}var a=n(9),i={animationend:r("Animation","AnimationEnd"),animationiteration:r("Animation","AnimationIteration"),animationstart:r("Animation","AnimationStart"),transitionend:r("Transition","TransitionEnd")},u={},s={};a.canUseDOM&&(s=document.createElement("div").style,"AnimationEvent"in window||(delete i.animationend.animation,delete i.animationiteration.animation,delete i.animationstart.animation),"TransitionEvent"in window||delete i.transitionend.transition),e.exports=o},function(e,t,n){"use strict";function r(){this._rootNodeID&&p.updateWrapper(this)}function o(e){return"checkbox"===e.type||"radio"===e.type?null!=e.checked:null!=e.value}function a(e){var t=this._currentElement.props,n=l.executeOnChange(t,e);f.asap(r,this);var o=t.name;if("radio"===t.type&&null!=o){for(var a=c.getNodeFromInstance(this),u=a;u.parentNode;)u=u.parentNode;for(var s=u.querySelectorAll("input[name="+JSON.stringify(""+o)+'][type="radio"]'),p=0;p<s.length;p++){var d=s[p];if(d!==a&&d.form===a.form){var h=c.getInstanceFromNode(d);h||i("90"),f.asap(r,h)}}}return n}var i=n(3),u=n(4),s=n(110),l=n(67),c=n(6),f=n(14),p=(n(1),n(2),{getHostProps:function(e,t){var n=l.getValue(t),r=l.getChecked(t);return u({type:void 0,step:void 0,min:void 0,max:void 0},t,{defaultChecked:void 0,defaultValue:void 0,value:null!=n?n:e._wrapperState.initialValue,checked:null!=r?r:e._wrapperState.initialChecked,onChange:e._wrapperState.onChange})},mountWrapper:function(e,t){var n=t.defaultValue;e._wrapperState={initialChecked:null!=t.checked?t.checked:t.defaultChecked,initialValue:null!=t.value?t.value:n,listeners:null,onChange:a.bind(e),controlled:o(t)}},updateWrapper:function(e){var t=e._currentElement.props,n=t.checked;null!=n&&s.setValueForProperty(c.getNodeFromInstance(e),"checked",n||!1);var r=c.getNodeFromInstance(e),o=l.getValue(t);if(null!=o)if(0===o&&""===r.value)r.value="0";else if("number"===t.type){var a=parseFloat(r.value,10)||0;(o!=a||o==a&&r.value!=o)&&(r.value=""+o)}else r.value!==""+o&&(r.value=""+o);else null==t.value&&null!=t.defaultValue&&r.defaultValue!==""+t.defaultValue&&(r.defaultValue=""+t.defaultValue),null==t.checked&&null!=t.defaultChecked&&(r.defaultChecked=!!t.defaultChecked)},postMountWrapper:function(e){var t=e._currentElement.props,n=c.getNodeFromInstance(e);switch(t.type){case"submit":case"reset":break;case"color":case"date":case"datetime":case"datetime-local":case"month":case"time":case"week":n.value="",n.value=n.defaultValue;break;default:n.value=n.value}var r=n.name;""!==r&&(n.name=""),n.defaultChecked=!n.defaultChecked,n.defaultChecked=!n.defaultChecked,""!==r&&(n.name=r)}});e.exports=p},function(e,t,n){"use strict";e.exports="SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED"},function(e,t,n){"use strict";function r(e){var t="";return a.Children.forEach(e,function(e){null!=e&&("string"==typeof e||"number"==typeof e?t+=e:s||(s=!0))}),t}var o=n(4),a=n(24),i=n(6),u=n(111),s=(n(2),!1),l={mountWrapper:function(e,t,n){var o=null;if(null!=n){var a=n;"optgroup"===a._tag&&(a=a._hostParent),null!=a&&"select"===a._tag&&(o=u.getSelectValueContext(a))}var i=null;if(null!=o){var s;if(s=null!=t.value?t.value+"":r(t.children),i=!1,Array.isArray(o)){for(var l=0;l<o.length;l++)if(""+o[l]===s){i=!0;break}}else i=""+o===s}e._wrapperState={selected:i}},postMountWrapper:function(e){var t=e._currentElement.props;if(null!=t.value){i.getNodeFromInstance(e).setAttribute("value",t.value)}},getHostProps:function(e,t){var n=o({selected:void 0,children:void 0},t);null!=e._wrapperState.selected&&(n.selected=e._wrapperState.selected);var a=r(t.children);return a&&(n.children=a),n}};e.exports=l},function(e,t,n){"use strict";function r(){this._rootNodeID&&c.updateWrapper(this)}function o(e){var t=this._currentElement.props,n=u.executeOnChange(t,e);return l.asap(r,this),n}var a=n(3),i=n(4),u=n(67),s=n(6),l=n(14),c=(n(1),n(2),{getHostProps:function(e,t){return null!=t.dangerouslySetInnerHTML&&a("91"),i({},t,{value:void 0,defaultValue:void 0,children:""+e._wrapperState.initialValue,onChange:e._wrapperState.onChange})},mountWrapper:function(e,t){var n=u.getValue(t),r=n;if(null==n){var i=t.defaultValue,s=t.children;null!=s&&(null!=i&&a("92"),Array.isArray(s)&&(s.length<=1||a("93"),s=s[0]),i=""+s),null==i&&(i=""),r=i}e._wrapperState={initialValue:""+r,listeners:null,onChange:o.bind(e)}},updateWrapper:function(e){var t=e._currentElement.props,n=s.getNodeFromInstance(e),r=u.getValue(t);if(null!=r){var o=""+r;o!==n.value&&(n.value=o),null==t.defaultValue&&(n.defaultValue=o)}null!=t.defaultValue&&(n.defaultValue=t.defaultValue)},postMountWrapper:function(e){var t=s.getNodeFromInstance(e),n=t.textContent;n===e._wrapperState.initialValue&&(t.value=n)}});e.exports=c},function(e,t,n){"use strict";function r(e,t,n){return{type:"INSERT_MARKUP",content:e,fromIndex:null,fromNode:null,toIndex:n,afterNode:t}}function o(e,t,n){return{type:"MOVE_EXISTING",content:null,fromIndex:e._mountIndex,fromNode:p.getHostNode(e),toIndex:n,afterNode:t}}function a(e,t){return{type:"REMOVE_NODE",content:null,fromIndex:e._mountIndex,fromNode:t,toIndex:null,afterNode:null}}function i(e){return{type:"SET_MARKUP",content:e,fromIndex:null,fromNode:null,toIndex:null,afterNode:null}}function u(e){return{type:"TEXT_CONTENT",content:e,fromIndex:null,fromNode:null,toIndex:null,afterNode:null}}function s(e,t){return t&&(e=e||[],e.push(t)),e}function l(e,t){f.processChildrenUpdates(e,t)}var c=n(3),f=n(68),p=(n(35),n(13),n(17),n(27)),d=n(220),h=(n(11),n(225)),y=(n(1),{Mixin:{_reconcilerInstantiateChildren:function(e,t,n){return d.instantiateChildren(e,t,n)},_reconcilerUpdateChildren:function(e,t,n,r,o,a){var i,u=0;return i=h(t,u),d.updateChildren(e,i,n,r,o,this,this._hostContainerInfo,a,u),i},mountChildren:function(e,t,n){var r=this._reconcilerInstantiateChildren(e,t,n);this._renderedChildren=r;var o=[],a=0;for(var i in r)if(r.hasOwnProperty(i)){var u=r[i],s=0,l=p.mountComponent(u,t,this,this._hostContainerInfo,n,s);u._mountIndex=a++,o.push(l)}return o},updateTextContent:function(e){var t=this._renderedChildren;d.unmountChildren(t,!1);for(var n in t)t.hasOwnProperty(n)&&c("118");l(this,[u(e)])},updateMarkup:function(e){var t=this._renderedChildren;d.unmountChildren(t,!1);for(var n in t)t.hasOwnProperty(n)&&c("118");l(this,[i(e)])},updateChildren:function(e,t,n){this._updateChildren(e,t,n)},_updateChildren:function(e,t,n){var r=this._renderedChildren,o={},a=[],i=this._reconcilerUpdateChildren(r,e,a,o,t,n);if(i||r){var u,c=null,f=0,d=0,h=0,y=null;for(u in i)if(i.hasOwnProperty(u)){var v=r&&r[u],m=i[u];v===m?(c=s(c,this.moveChild(v,y,f,d)),d=Math.max(v._mountIndex,d),v._mountIndex=f):(v&&(d=Math.max(v._mountIndex,d)),c=s(c,this._mountChildAtIndex(m,a[h],y,f,t,n)),h++),f++,y=p.getHostNode(m)}for(u in o)o.hasOwnProperty(u)&&(c=s(c,this._unmountChild(r[u],o[u])));c&&l(this,c),this._renderedChildren=i}},unmountChildren:function(e){var t=this._renderedChildren;d.unmountChildren(t,e),this._renderedChildren=null},moveChild:function(e,t,n,r){if(e._mountIndex<r)return o(e,t,n)},createChild:function(e,t,n){return r(n,t,e._mountIndex)},removeChild:function(e,t){return a(e,t)},_mountChildAtIndex:function(e,t,n,r,o,a){return e._mountIndex=r,this.createChild(e,n,t)},_unmountChild:function(e,t){var n=this.removeChild(e,t);return e._mountIndex=null,n}}});e.exports=y},function(e,t,n){"use strict";(function(t){function r(e,t,n,r){var o=void 0===e[n];null!=t&&o&&(e[n]=a(t,!0))}var o=n(27),a=n(113),i=(n(71),n(70)),u=n(117);n(2);void 0!==t&&Object({NODE_ENV:"production"});var s={instantiateChildren:function(e,t,n,o){if(null==e)return null;var a={};return u(e,r,a),a},updateChildren:function(e,t,n,r,u,s,l,c,f){if(t||e){var p,d;for(p in t)if(t.hasOwnProperty(p)){d=e&&e[p];var h=d&&d._currentElement,y=t[p];if(null!=d&&i(h,y))o.receiveComponent(d,y,u,c),t[p]=d;else{d&&(r[p]=o.getHostNode(d),o.unmountComponent(d,!1));var v=a(y,!0);t[p]=v;var m=o.mountComponent(v,u,s,l,c,f);n.push(m)}}for(p in e)!e.hasOwnProperty(p)||t&&t.hasOwnProperty(p)||(d=e[p],r[p]=o.getHostNode(d),o.unmountComponent(d,!1))}},unmountChildren:function(e,t){for(var n in e)if(e.hasOwnProperty(n)){var r=e[n];o.unmountComponent(r,t)}}};e.exports=s}).call(t,n(112))},function(e,t,n){"use strict";function r(e){}function o(e){return!(!e.prototype||!e.prototype.isReactComponent)}function a(e){return!(!e.prototype||!e.prototype.isPureReactComponent)}var i=n(3),u=n(4),s=n(24),l=n(68),c=n(17),f=n(60),p=n(35),d=(n(13),n(114)),h=n(27),y=n(41),v=(n(1),n(69)),m=n(70),g=(n(2),{ImpureClass:0,PureClass:1,StatelessFunctional:2});r.prototype.render=function(){var e=p.get(this)._currentElement.type,t=e(this.props,this.context,this.updater);return t};var b=1,_={construct:function(e){this._currentElement=e,this._rootNodeID=0,this._compositeType=null,this._instance=null,this._hostParent=null,this._hostContainerInfo=null,this._updateBatchNumber=null,this._pendingElement=null,this._pendingStateQueue=null,this._pendingReplaceState=!1,this._pendingForceUpdate=!1,this._renderedNodeType=null,this._renderedComponent=null,this._context=null,this._mountOrder=0,this._topLevelWrapper=null,this._pendingCallbacks=null,this._calledComponentWillUnmount=!1},mountComponent:function(e,t,n,u){this._context=u,this._mountOrder=b++,this._hostParent=t,this._hostContainerInfo=n;var l,c=this._currentElement.props,f=this._processContext(u),d=this._currentElement.type,h=e.getUpdateQueue(),v=o(d),m=this._constructComponent(v,c,f,h);v||null!=m&&null!=m.render?a(d)?this._compositeType=g.PureClass:this._compositeType=g.ImpureClass:(l=m,null===m||!1===m||s.isValidElement(m)||i("105",d.displayName||d.name||"Component"),m=new r(d),this._compositeType=g.StatelessFunctional);m.props=c,m.context=f,m.refs=y,m.updater=h,this._instance=m,p.set(m,this);var _=m.state;void 0===_&&(m.state=_=null),("object"!=typeof _||Array.isArray(_))&&i("106",this.getName()||"ReactCompositeComponent"),this._pendingStateQueue=null,this._pendingReplaceState=!1,this._pendingForceUpdate=!1;var w;return w=m.unstable_handleError?this.performInitialMountWithErrorHandling(l,t,n,e,u):this.performInitialMount(l,t,n,e,u),m.componentDidMount&&e.getReactMountReady().enqueue(m.componentDidMount,m),w},_constructComponent:function(e,t,n,r){return this._constructComponentWithoutOwner(e,t,n,r)},_constructComponentWithoutOwner:function(e,t,n,r){var o=this._currentElement.type;return e?new o(t,n,r):o(t,n,r)},performInitialMountWithErrorHandling:function(e,t,n,r,o){var a,i=r.checkpoint();try{a=this.performInitialMount(e,t,n,r,o)}catch(u){r.rollback(i),this._instance.unstable_handleError(u),this._pendingStateQueue&&(this._instance.state=this._processPendingState(this._instance.props,this._instance.context)),i=r.checkpoint(),this._renderedComponent.unmountComponent(!0),r.rollback(i),a=this.performInitialMount(e,t,n,r,o)}return a},performInitialMount:function(e,t,n,r,o){var a=this._instance,i=0;a.componentWillMount&&(a.componentWillMount(),this._pendingStateQueue&&(a.state=this._processPendingState(a.props,a.context))),void 0===e&&(e=this._renderValidatedComponent());var u=d.getType(e);this._renderedNodeType=u;var s=this._instantiateReactComponent(e,u!==d.EMPTY);this._renderedComponent=s;var l=h.mountComponent(s,r,t,n,this._processChildContext(o),i);return l},getHostNode:function(){return h.getHostNode(this._renderedComponent)},unmountComponent:function(e){if(this._renderedComponent){var t=this._instance;if(t.componentWillUnmount&&!t._calledComponentWillUnmount)if(t._calledComponentWillUnmount=!0,e){var n=this.getName()+".componentWillUnmount()";f.invokeGuardedCallback(n,t.componentWillUnmount.bind(t))}else t.componentWillUnmount();this._renderedComponent&&(h.unmountComponent(this._renderedComponent,e),this._renderedNodeType=null,this._renderedComponent=null,this._instance=null),this._pendingStateQueue=null,this._pendingReplaceState=!1,this._pendingForceUpdate=!1,this._pendingCallbacks=null,this._pendingElement=null,this._context=null,this._rootNodeID=0,this._topLevelWrapper=null,p.remove(t)}},_maskContext:function(e){var t=this._currentElement.type,n=t.contextTypes;if(!n)return y;var r={};for(var o in n)r[o]=e[o];return r},_processContext:function(e){var t=this._maskContext(e);return t},_processChildContext:function(e){var t,n=this._currentElement.type,r=this._instance;if(r.getChildContext&&(t=r.getChildContext()),t){"object"!=typeof n.childContextTypes&&i("107",this.getName()||"ReactCompositeComponent");for(var o in t)o in n.childContextTypes||i("108",this.getName()||"ReactCompositeComponent",o);return u({},e,t)}return e},_checkContextTypes:function(e,t,n){},receiveComponent:function(e,t,n){var r=this._currentElement,o=this._context;this._pendingElement=null,this.updateComponent(t,r,e,o,n)},performUpdateIfNecessary:function(e){null!=this._pendingElement?h.receiveComponent(this,this._pendingElement,e,this._context):null!==this._pendingStateQueue||this._pendingForceUpdate?this.updateComponent(e,this._currentElement,this._currentElement,this._context,this._context):this._updateBatchNumber=null},updateComponent:function(e,t,n,r,o){var a=this._instance;null==a&&i("136",this.getName()||"ReactCompositeComponent");var u,s=!1;this._context===o?u=a.context:(u=this._processContext(o),s=!0);var l=t.props,c=n.props;t!==n&&(s=!0),s&&a.componentWillReceiveProps&&a.componentWillReceiveProps(c,u);var f=this._processPendingState(c,u),p=!0;this._pendingForceUpdate||(a.shouldComponentUpdate?p=a.shouldComponentUpdate(c,f,u):this._compositeType===g.PureClass&&(p=!v(l,c)||!v(a.state,f))),this._updateBatchNumber=null,p?(this._pendingForceUpdate=!1,this._performComponentUpdate(n,c,f,u,e,o)):(this._currentElement=n,this._context=o,a.props=c,a.state=f,a.context=u)},_processPendingState:function(e,t){var n=this._instance,r=this._pendingStateQueue,o=this._pendingReplaceState;if(this._pendingReplaceState=!1,this._pendingStateQueue=null,!r)return n.state;if(o&&1===r.length)return r[0];for(var a=u({},o?r[0]:n.state),i=o?1:0;i<r.length;i++){var s=r[i];u(a,"function"==typeof s?s.call(n,a,e,t):s)}return a},_performComponentUpdate:function(e,t,n,r,o,a){var i,u,s,l=this._instance,c=Boolean(l.componentDidUpdate);c&&(i=l.props,u=l.state,s=l.context),l.componentWillUpdate&&l.componentWillUpdate(t,n,r),this._currentElement=e,this._context=a,l.props=t,l.state=n,l.context=r,this._updateRenderedComponent(o,a),c&&o.getReactMountReady().enqueue(l.componentDidUpdate.bind(l,i,u,s),l)},_updateRenderedComponent:function(e,t){var n=this._renderedComponent,r=n._currentElement,o=this._renderValidatedComponent(),a=0;if(m(r,o))h.receiveComponent(n,o,e,this._processChildContext(t));else{var i=h.getHostNode(n);h.unmountComponent(n,!1);var u=d.getType(o);this._renderedNodeType=u;var s=this._instantiateReactComponent(o,u!==d.EMPTY);this._renderedComponent=s;var l=h.mountComponent(s,e,this._hostParent,this._hostContainerInfo,this._processChildContext(t),a);this._replaceNodeWithMarkup(i,l,n)}},_replaceNodeWithMarkup:function(e,t,n){l.replaceNodeWithMarkup(e,t,n)},_renderValidatedComponentWithoutOwnerOrContext:function(){var e=this._instance;return e.render()},_renderValidatedComponent:function(){var e;if(this._compositeType!==g.StatelessFunctional){c.current=this;try{e=this._renderValidatedComponentWithoutOwnerOrContext()}finally{c.current=null}}else e=this._renderValidatedComponentWithoutOwnerOrContext();return null===e||!1===e||s.isValidElement(e)||i("109",this.getName()||"ReactCompositeComponent"),e},attachRef:function(e,t){var n=this.getPublicInstance();null==n&&i("110");var r=t.getPublicInstance();(n.refs===y?n.refs={}:n.refs)[e]=r},detachRef:function(e){delete this.getPublicInstance().refs[e]},getName:function(){var e=this._currentElement.type,t=this._instance&&this._instance.constructor;return e.displayName||t&&t.displayName||e.name||t&&t.name||null},getPublicInstance:function(){var e=this._instance;return this._compositeType===g.StatelessFunctional?null:e},_instantiateReactComponent:null};e.exports=_},function(e,t,n){"use strict";function r(){return o++}var o=1;e.exports=r},function(e,t,n){"use strict";var r="function"==typeof Symbol&&Symbol.for&&Symbol.for("react.element")||60103;e.exports=r},function(e,t,n){"use strict";function r(e){var t=e&&(o&&e[o]||e[a]);if("function"==typeof t)return t}var o="function"==typeof Symbol&&Symbol.iterator,a="@@iterator";e.exports=r},function(e,t,n){"use strict";(function(t){function r(e,t,n,r){if(e&&"object"==typeof e){var o=e,a=void 0===o[n];a&&null!=t&&(o[n]=t)}}function o(e,t){if(null==e)return e;var n={};return a(e,r,n),n}var a=(n(71),n(117));n(2);void 0!==t&&Object({NODE_ENV:"production"}),e.exports=o}).call(t,n(112))},function(e,t,n){"use strict";function r(e){this.reinitializeTransaction(),this.renderToStaticMarkup=e,this.useCreateElement=!1,this.updateQueue=new u(this)}var o=n(4),a=n(22),i=n(42),u=(n(13),n(227)),s=[],l={enqueue:function(){}},c={getTransactionWrappers:function(){return s},getReactMountReady:function(){return l},getUpdateQueue:function(){return this.updateQueue},destructor:function(){},checkpoint:function(){},rollback:function(){}};o(r.prototype,i,c),a.addPoolingTo(r),e.exports=r},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var o=n(72),a=(n(2),function(){function e(t){r(this,e),this.transaction=t}return e.prototype.isMounted=function(e){return!1},e.prototype.enqueueCallback=function(e,t,n){this.transaction.isInTransaction()&&o.enqueueCallback(e,t,n)},e.prototype.enqueueForceUpdate=function(e){this.transaction.isInTransaction()&&o.enqueueForceUpdate(e)},e.prototype.enqueueReplaceState=function(e,t){this.transaction.isInTransaction()&&o.enqueueReplaceState(e,t)},e.prototype.enqueueSetState=function(e,t){this.transaction.isInTransaction()&&o.enqueueSetState(e,t)},e}());e.exports=a},function(e,t,n){"use strict";var r=n(4),o=n(28),a=n(6),i=function(e){this._currentElement=null,this._hostNode=null,this._hostParent=null,this._hostContainerInfo=null,this._domID=0};r(i.prototype,{mountComponent:function(e,t,n,r){var i=n._idCounter++;this._domID=i,this._hostParent=t,this._hostContainerInfo=n;var u=" react-empty: "+this._domID+" ";if(e.useCreateElement){var s=n._ownerDocument,l=s.createComment(u);return a.precacheNode(this,l),o(l)}return e.renderToStaticMarkup?"":"\x3c!--"+u+"--\x3e"},receiveComponent:function(){},getHostNode:function(){return a.getNodeFromInstance(this)},unmountComponent:function(){a.uncacheNode(this)}}),e.exports=i},function(e,t,n){"use strict";function r(e,t){"_hostNode"in e||s("33"),"_hostNode"in t||s("33");for(var n=0,r=e;r;r=r._hostParent)n++;for(var o=0,a=t;a;a=a._hostParent)o++;for(;n-o>0;)e=e._hostParent,n--;for(;o-n>0;)t=t._hostParent,o--;for(var i=n;i--;){if(e===t)return e;e=e._hostParent,t=t._hostParent}return null}function o(e,t){"_hostNode"in e||s("35"),"_hostNode"in t||s("35");for(;t;){if(t===e)return!0;t=t._hostParent}return!1}function a(e){return"_hostNode"in e||s("36"),e._hostParent}function i(e,t,n){for(var r=[];e;)r.push(e),e=e._hostParent;var o;for(o=r.length;o-- >0;)t(r[o],"captured",n);for(o=0;o<r.length;o++)t(r[o],"bubbled",n)}function u(e,t,n,o,a){for(var i=e&&t?r(e,t):null,u=[];e&&e!==i;)u.push(e),e=e._hostParent;for(var s=[];t&&t!==i;)s.push(t),t=t._hostParent;var l;for(l=0;l<u.length;l++)n(u[l],"bubbled",o);for(l=s.length;l-- >0;)n(s[l],"captured",a)}var s=n(3);n(1);e.exports={isAncestor:o,getLowestCommonAncestor:r,getParentInstance:a,traverseTwoPhase:i,traverseEnterLeave:u}},function(e,t,n){"use strict";var r=n(3),o=n(4),a=n(64),i=n(28),u=n(6),s=n(45),l=(n(1),n(73),function(e){this._currentElement=e,this._stringText=""+e,this._hostNode=null,this._hostParent=null,this._domID=0,this._mountIndex=0,this._closingComment=null,this._commentNodes=null});o(l.prototype,{mountComponent:function(e,t,n,r){var o=n._idCounter++,a=" react-text: "+o+" ";if(this._domID=o,this._hostParent=t,e.useCreateElement){var l=n._ownerDocument,c=l.createComment(a),f=l.createComment(" /react-text "),p=i(l.createDocumentFragment());return i.queueChild(p,i(c)),this._stringText&&i.queueChild(p,i(l.createTextNode(this._stringText))),i.queueChild(p,i(f)),u.precacheNode(this,c),this._closingComment=f,p}var d=s(this._stringText);return e.renderToStaticMarkup?d:"\x3c!--"+a+"--\x3e"+d+"\x3c!-- /react-text --\x3e"},receiveComponent:function(e,t){if(e!==this._currentElement){this._currentElement=e;var n=""+e;if(n!==this._stringText){this._stringText=n;var r=this.getHostNode();a.replaceDelimitedText(r[0],r[1],n)}}},getHostNode:function(){var e=this._commentNodes;if(e)return e;if(!this._closingComment)for(var t=u.getNodeFromInstance(this),n=t.nextSibling;;){if(null==n&&r("67",this._domID),8===n.nodeType&&" /react-text "===n.nodeValue){this._closingComment=n;break}n=n.nextSibling}return e=[this._hostNode,this._closingComment],this._commentNodes=e,e},unmountComponent:function(){this._closingComment=null,this._commentNodes=null,u.uncacheNode(this)}}),e.exports=l},function(e,t,n){"use strict";function r(){this.reinitializeTransaction()}var o=n(4),a=n(14),i=n(42),u=n(11),s={initialize:u,close:function(){p.isBatchingUpdates=!1}},l={initialize:u,close:a.flushBatchedUpdates.bind(a)},c=[l,s];o(r.prototype,i,{getTransactionWrappers:function(){return c}});var f=new r,p={isBatchingUpdates:!1,batchedUpdates:function(e,t,n,r,o,a){var i=p.isBatchingUpdates;return p.isBatchingUpdates=!0,i?e(t,n,r,o,a):f.perform(e,null,t,n,r,o,a)}};e.exports=p},function(e,t,n){"use strict";function r(e){for(;e._hostParent;)e=e._hostParent;var t=f.getNodeFromInstance(e),n=t.parentNode;return f.getClosestInstanceFromNode(n)}function o(e,t){this.topLevelType=e,this.nativeEvent=t,this.ancestors=[]}function a(e){var t=d(e.nativeEvent),n=f.getClosestInstanceFromNode(t),o=n;do{e.ancestors.push(o),o=o&&r(o)}while(o);for(var a=0;a<e.ancestors.length;a++)n=e.ancestors[a],y._handleTopLevel(e.topLevelType,n,e.nativeEvent,d(e.nativeEvent))}function i(e){e(h(window))}var u=n(4),s=n(119),l=n(9),c=n(22),f=n(6),p=n(14),d=n(61),h=n(233);u(o.prototype,{destructor:function(){this.topLevelType=null,this.nativeEvent=null,this.ancestors.length=0}}),c.addPoolingTo(o,c.twoArgumentPooler);var y={_enabled:!0,_handleTopLevel:null,WINDOW_HANDLE:l.canUseDOM?window:null,setHandleTopLevel:function(e){y._handleTopLevel=e},setEnabled:function(e){y._enabled=!!e},isEnabled:function(){return y._enabled},trapBubbledEvent:function(e,t,n){return n?s.listen(n,t,y.dispatchEvent.bind(null,e)):null},trapCapturedEvent:function(e,t,n){return n?s.capture(n,t,y.dispatchEvent.bind(null,e)):null},monitorScrollValue:function(e){var t=i.bind(null,e);s.listen(window,"scroll",t)},dispatchEvent:function(e,t){if(y._enabled){var n=o.getPooled(e,t);try{p.batchedUpdates(a,n)}finally{o.release(n)}}}};e.exports=y},function(e,t,n){"use strict";function r(e){return e.Window&&e instanceof e.Window?{x:e.pageXOffset||e.document.documentElement.scrollLeft,y:e.pageYOffset||e.document.documentElement.scrollTop}:{x:e.scrollLeft,y:e.scrollTop}}e.exports=r},function(e,t,n){"use strict";var r=n(26),o=n(33),a=n(59),i=n(68),u=n(115),s=n(46),l=n(116),c=n(14),f={Component:i.injection,DOMProperty:r.injection,EmptyComponent:u.injection,EventPluginHub:o.injection,EventPluginUtils:a.injection,EventEmitter:s.injection,HostComponent:l.injection,Updates:c.injection};e.exports=f},function(e,t,n){"use strict";function r(e){this.reinitializeTransaction(),this.renderToStaticMarkup=!1,this.reactMountReady=a.getPooled(null),this.useCreateElement=e}var o=n(4),a=n(102),i=n(22),u=n(46),s=n(120),l=(n(13),n(42)),c=n(72),f={initialize:s.getSelectionInformation,close:s.restoreSelection},p={initialize:function(){var e=u.isEnabled();return u.setEnabled(!1),e},close:function(e){u.setEnabled(e)}},d={initialize:function(){this.reactMountReady.reset()},close:function(){this.reactMountReady.notifyAll()}},h=[f,p,d],y={getTransactionWrappers:function(){return h},getReactMountReady:function(){return this.reactMountReady},getUpdateQueue:function(){return c},checkpoint:function(){return this.reactMountReady.checkpoint()},rollback:function(e){this.reactMountReady.rollback(e)},destructor:function(){a.release(this.reactMountReady),this.reactMountReady=null}};o(r.prototype,l,y),i.addPoolingTo(r),e.exports=r},function(e,t,n){"use strict";function r(e,t,n,r){return e===n&&t===r}function o(e){var t=document.selection,n=t.createRange(),r=n.text.length,o=n.duplicate();o.moveToElementText(e),o.setEndPoint("EndToStart",n);var a=o.text.length;return{start:a,end:a+r}}function a(e){var t=window.getSelection&&window.getSelection();if(!t||0===t.rangeCount)return null;var n=t.anchorNode,o=t.anchorOffset,a=t.focusNode,i=t.focusOffset,u=t.getRangeAt(0);try{u.startContainer.nodeType,u.endContainer.nodeType}catch(e){return null}var s=r(t.anchorNode,t.anchorOffset,t.focusNode,t.focusOffset),l=s?0:u.toString().length,c=u.cloneRange();c.selectNodeContents(e),c.setEnd(u.startContainer,u.startOffset);var f=r(c.startContainer,c.startOffset,c.endContainer,c.endOffset),p=f?0:c.toString().length,d=p+l,h=document.createRange();h.setStart(n,o),h.setEnd(a,i);var y=h.collapsed;return{start:y?d:p,end:y?p:d}}function i(e,t){var n,r,o=document.selection.createRange().duplicate();void 0===t.end?(n=t.start,r=n):t.start>t.end?(n=t.end,r=t.start):(n=t.start,r=t.end),o.moveToElementText(e),o.moveStart("character",n),o.setEndPoint("EndToStart",o),o.moveEnd("character",r-n),o.select()}function u(e,t){if(window.getSelection){var n=window.getSelection(),r=e[c()].length,o=Math.min(t.start,r),a=void 0===t.end?o:Math.min(t.end,r);if(!n.extend&&o>a){var i=a;a=o,o=i}var u=l(e,o),s=l(e,a);if(u&&s){var f=document.createRange();f.setStart(u.node,u.offset),n.removeAllRanges(),o>a?(n.addRange(f),n.extend(s.node,s.offset)):(f.setEnd(s.node,s.offset),n.addRange(f))}}}var s=n(9),l=n(237),c=n(101),f=s.canUseDOM&&"selection"in document&&!("getSelection"in window),p={getOffsets:f?o:a,setOffsets:f?i:u};e.exports=p},function(e,t,n){"use strict";function r(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function o(e){for(;e;){if(e.nextSibling)return e.nextSibling;e=e.parentNode}}function a(e,t){for(var n=r(e),a=0,i=0;n;){if(3===n.nodeType){if(i=a+n.textContent.length,a<=t&&i>=t)return{node:n,offset:t-a};a=i}n=r(o(n))}}e.exports=a},function(e,t,n){"use strict";function r(e,t){return!(!e||!t)&&(e===t||!o(e)&&(o(t)?r(e,t.parentNode):"contains"in e?e.contains(t):!!e.compareDocumentPosition&&!!(16&e.compareDocumentPosition(t))))}var o=n(239);e.exports=r},function(e,t,n){"use strict";function r(e){return o(e)&&3==e.nodeType}var o=n(240);e.exports=r},function(e,t,n){"use strict";function r(e){var t=e?e.ownerDocument||e:document,n=t.defaultView||window;return!(!e||!("function"==typeof n.Node?e instanceof n.Node:"object"==typeof e&&"number"==typeof e.nodeType&&"string"==typeof e.nodeName))}e.exports=r},function(e,t,n){"use strict";var r={xlink:"http://www.w3.org/1999/xlink",xml:"http://www.w3.org/XML/1998/namespace"},o={accentHeight:"accent-height",accumulate:0,additive:0,alignmentBaseline:"alignment-baseline",allowReorder:"allowReorder",alphabetic:0,amplitude:0,arabicForm:"arabic-form",ascent:0,attributeName:"attributeName",attributeType:"attributeType",autoReverse:"autoReverse",azimuth:0,baseFrequency:"baseFrequency",baseProfile:"baseProfile",baselineShift:"baseline-shift",bbox:0,begin:0,bias:0,by:0,calcMode:"calcMode",capHeight:"cap-height",clip:0,clipPath:"clip-path",clipRule:"clip-rule",clipPathUnits:"clipPathUnits",colorInterpolation:"color-interpolation",colorInterpolationFilters:"color-interpolation-filters",colorProfile:"color-profile",colorRendering:"color-rendering",contentScriptType:"contentScriptType",contentStyleType:"contentStyleType",cursor:0,cx:0,cy:0,d:0,decelerate:0,descent:0,diffuseConstant:"diffuseConstant",direction:0,display:0,divisor:0,dominantBaseline:"dominant-baseline",dur:0,dx:0,dy:0,edgeMode:"edgeMode",elevation:0,enableBackground:"enable-background",end:0,exponent:0,externalResourcesRequired:"externalResourcesRequired",fill:0,fillOpacity:"fill-opacity",fillRule:"fill-rule",filter:0,filterRes:"filterRes",filterUnits:"filterUnits",floodColor:"flood-color",floodOpacity:"flood-opacity",focusable:0,fontFamily:"font-family",fontSize:"font-size",fontSizeAdjust:"font-size-adjust",fontStretch:"font-stretch",fontStyle:"font-style",fontVariant:"font-variant",fontWeight:"font-weight",format:0,from:0,fx:0,fy:0,g1:0,g2:0,glyphName:"glyph-name",glyphOrientationHorizontal:"glyph-orientation-horizontal",glyphOrientationVertical:"glyph-orientation-vertical",glyphRef:"glyphRef",gradientTransform:"gradientTransform",gradientUnits:"gradientUnits",hanging:0,horizAdvX:"horiz-adv-x",horizOriginX:"horiz-origin-x",ideographic:0,imageRendering:"image-rendering",in:0,in2:0,intercept:0,k:0,k1:0,k2:0,k3:0,k4:0,kernelMatrix:"kernelMatrix",kernelUnitLength:"kernelUnitLength",kerning:0,keyPoints:"keyPoints",keySplines:"keySplines",keyTimes:"keyTimes",lengthAdjust:"lengthAdjust",letterSpacing:"letter-spacing",lightingColor:"lighting-color",limitingConeAngle:"limitingConeAngle",local:0,markerEnd:"marker-end",markerMid:"marker-mid",markerStart:"marker-start",markerHeight:"markerHeight",markerUnits:"markerUnits",markerWidth:"markerWidth",mask:0,maskContentUnits:"maskContentUnits",maskUnits:"maskUnits",mathematical:0,mode:0,numOctaves:"numOctaves",offset:0,opacity:0,operator:0,order:0,orient:0,orientation:0,origin:0,overflow:0,overlinePosition:"overline-position",overlineThickness:"overline-thickness",paintOrder:"paint-order",panose1:"panose-1",pathLength:"pathLength",patternContentUnits:"patternContentUnits",patternTransform:"patternTransform",patternUnits:"patternUnits",pointerEvents:"pointer-events",points:0,pointsAtX:"pointsAtX",pointsAtY:"pointsAtY",pointsAtZ:"pointsAtZ",preserveAlpha:"preserveAlpha",preserveAspectRatio:"preserveAspectRatio",primitiveUnits:"primitiveUnits",r:0,radius:0,refX:"refX",refY:"refY",renderingIntent:"rendering-intent",repeatCount:"repeatCount",repeatDur:"repeatDur",requiredExtensions:"requiredExtensions",requiredFeatures:"requiredFeatures",restart:0,result:0,rotate:0,rx:0,ry:0,scale:0,seed:0,shapeRendering:"shape-rendering",slope:0,spacing:0,specularConstant:"specularConstant",specularExponent:"specularExponent",speed:0,spreadMethod:"spreadMethod",startOffset:"startOffset",stdDeviation:"stdDeviation",stemh:0,stemv:0,stitchTiles:"stitchTiles",stopColor:"stop-color",stopOpacity:"stop-opacity",strikethroughPosition:"strikethrough-position",strikethroughThickness:"strikethrough-thickness",string:0,stroke:0,strokeDasharray:"stroke-dasharray",strokeDashoffset:"stroke-dashoffset",strokeLinecap:"stroke-linecap",strokeLinejoin:"stroke-linejoin",strokeMiterlimit:"stroke-miterlimit",strokeOpacity:"stroke-opacity",strokeWidth:"stroke-width",surfaceScale:"surfaceScale",systemLanguage:"systemLanguage",tableValues:"tableValues",targetX:"targetX",targetY:"targetY",textAnchor:"text-anchor",textDecoration:"text-decoration",textRendering:"text-rendering",textLength:"textLength",to:0,transform:0,u1:0,u2:0,underlinePosition:"underline-position",underlineThickness:"underline-thickness",unicode:0,unicodeBidi:"unicode-bidi",unicodeRange:"unicode-range",unitsPerEm:"units-per-em",vAlphabetic:"v-alphabetic",vHanging:"v-hanging",vIdeographic:"v-ideographic",vMathematical:"v-mathematical",values:0,vectorEffect:"vector-effect",version:0,vertAdvY:"vert-adv-y",vertOriginX:"vert-origin-x",vertOriginY:"vert-origin-y",viewBox:"viewBox",viewTarget:"viewTarget",visibility:0,widths:0,wordSpacing:"word-spacing",writingMode:"writing-mode",x:0,xHeight:"x-height",x1:0,x2:0,xChannelSelector:"xChannelSelector",xlinkActuate:"xlink:actuate",xlinkArcrole:"xlink:arcrole",xlinkHref:"xlink:href",xlinkRole:"xlink:role",xlinkShow:"xlink:show",xlinkTitle:"xlink:title",xlinkType:"xlink:type",xmlBase:"xml:base",xmlns:0,xmlnsXlink:"xmlns:xlink",xmlLang:"xml:lang",xmlSpace:"xml:space",y:0,y1:0,y2:0,yChannelSelector:"yChannelSelector",z:0,zoomAndPan:"zoomAndPan"},a={Properties:{},DOMAttributeNamespaces:{xlinkActuate:r.xlink,xlinkArcrole:r.xlink,xlinkHref:r.xlink,xlinkRole:r.xlink,xlinkShow:r.xlink,xlinkTitle:r.xlink,xlinkType:r.xlink,xmlBase:r.xml,xmlLang:r.xml,xmlSpace:r.xml},DOMAttributeNames:{}};Object.keys(o).forEach(function(e){a.Properties[e]=0,o[e]&&(a.DOMAttributeNames[e]=o[e])}),e.exports=a},function(e,t,n){"use strict";function r(e){if("selectionStart"in e&&s.hasSelectionCapabilities(e))return{start:e.selectionStart,end:e.selectionEnd};if(window.getSelection){var t=window.getSelection();return{anchorNode:t.anchorNode,anchorOffset:t.anchorOffset,focusNode:t.focusNode,focusOffset:t.focusOffset}}if(document.selection){var n=document.selection.createRange();return{parentElement:n.parentElement(),text:n.text,top:n.boundingTop,left:n.boundingLeft}}}function o(e,t){if(g||null==y||y!==c())return null;var n=r(y);if(!m||!p(m,n)){m=n;var o=l.getPooled(h.select,v,e,t);return o.type="select",o.target=y,a.accumulateTwoPhaseDispatches(o),o}return null}var a=n(32),i=n(9),u=n(6),s=n(120),l=n(18),c=n(121),f=n(105),p=n(69),d=i.canUseDOM&&"documentMode"in document&&document.documentMode<=11,h={select:{phasedRegistrationNames:{bubbled:"onSelect",captured:"onSelectCapture"},dependencies:["topBlur","topContextMenu","topFocus","topKeyDown","topKeyUp","topMouseDown","topMouseUp","topSelectionChange"]}},y=null,v=null,m=null,g=!1,b=!1,_={eventTypes:h,extractEvents:function(e,t,n,r){if(!b)return null;var a=t?u.getNodeFromInstance(t):window;switch(e){case"topFocus":(f(a)||"true"===a.contentEditable)&&(y=a,v=t,m=null);break;case"topBlur":y=null,v=null,m=null;break;case"topMouseDown":g=!0;break;case"topContextMenu":case"topMouseUp":return g=!1,o(n,r);case"topSelectionChange":if(d)break;case"topKeyDown":case"topKeyUp":return o(n,r)}return null},didPutListener:function(e,t,n){"onSelect"===t&&(b=!0)}};e.exports=_},function(e,t,n){"use strict";function r(e){return"."+e._rootNodeID}function o(e){return"button"===e||"input"===e||"select"===e||"textarea"===e}var a=n(3),i=n(119),u=n(32),s=n(6),l=n(244),c=n(245),f=n(18),p=n(246),d=n(247),h=n(43),y=n(249),v=n(250),m=n(251),g=n(34),b=n(252),_=n(11),w=n(74),E=(n(1),{}),O={};["abort","animationEnd","animationIteration","animationStart","blur","canPlay","canPlayThrough","click","contextMenu","copy","cut","doubleClick","drag","dragEnd","dragEnter","dragExit","dragLeave","dragOver","dragStart","drop","durationChange","emptied","encrypted","ended","error","focus","input","invalid","keyDown","keyPress","keyUp","load","loadedData","loadedMetadata","loadStart","mouseDown","mouseMove","mouseOut","mouseOver","mouseUp","paste","pause","play","playing","progress","rateChange","reset","scroll","seeked","seeking","stalled","submit","suspend","timeUpdate","touchCancel","touchEnd","touchMove","touchStart","transitionEnd","volumeChange","waiting","wheel"].forEach(function(e){var t=e[0].toUpperCase()+e.slice(1),n="on"+t,r="top"+t,o={phasedRegistrationNames:{bubbled:n,captured:n+"Capture"},dependencies:[r]};E[e]=o,O[r]=o});var P={},C={eventTypes:E,extractEvents:function(e,t,n,r){var o=O[e];if(!o)return null;var i;switch(e){case"topAbort":case"topCanPlay":case"topCanPlayThrough":case"topDurationChange":case"topEmptied":case"topEncrypted":case"topEnded":case"topError":case"topInput":case"topInvalid":case"topLoad":case"topLoadedData":case"topLoadedMetadata":case"topLoadStart":case"topPause":case"topPlay":case"topPlaying":case"topProgress":case"topRateChange":case"topReset":case"topSeeked":case"topSeeking":case"topStalled":case"topSubmit":case"topSuspend":case"topTimeUpdate":case"topVolumeChange":case"topWaiting":i=f;break;case"topKeyPress":if(0===w(n))return null;case"topKeyDown":case"topKeyUp":i=d;break;case"topBlur":case"topFocus":i=p;break;case"topClick":if(2===n.button)return null;case"topDoubleClick":case"topMouseDown":case"topMouseMove":case"topMouseUp":case"topMouseOut":case"topMouseOver":case"topContextMenu":i=h;break;case"topDrag":case"topDragEnd":case"topDragEnter":case"topDragExit":case"topDragLeave":case"topDragOver":case"topDragStart":case"topDrop":i=y;break;case"topTouchCancel":case"topTouchEnd":case"topTouchMove":case"topTouchStart":i=v;break;case"topAnimationEnd":case"topAnimationIteration":case"topAnimationStart":i=l;break;case"topTransitionEnd":i=m;break;case"topScroll":i=g;break;case"topWheel":i=b;break;case"topCopy":case"topCut":case"topPaste":i=c}i||a("86",e);var s=i.getPooled(o,t,n,r);return u.accumulateTwoPhaseDispatches(s),s},didPutListener:function(e,t,n){if("onClick"===t&&!o(e._tag)){var a=r(e),u=s.getNodeFromInstance(e);P[a]||(P[a]=i.listen(u,"click",_))}},willDeleteListener:function(e,t){if("onClick"===t&&!o(e._tag)){var n=r(e);P[n].remove(),delete P[n]}}};e.exports=C},function(e,t,n){"use strict";function r(e,t,n,r){return o.call(this,e,t,n,r)}var o=n(18),a={animationName:null,elapsedTime:null,pseudoElement:null};o.augmentClass(r,a),e.exports=r},function(e,t,n){"use strict";function r(e,t,n,r){return o.call(this,e,t,n,r)}var o=n(18),a={clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}};o.augmentClass(r,a),e.exports=r},function(e,t,n){"use strict";function r(e,t,n,r){return o.call(this,e,t,n,r)}var o=n(34),a={relatedTarget:null};o.augmentClass(r,a),e.exports=r},function(e,t,n){"use strict";function r(e,t,n,r){return o.call(this,e,t,n,r)}var o=n(34),a=n(74),i=n(248),u=n(63),s={key:i,location:null,ctrlKey:null,shiftKey:null,altKey:null,metaKey:null,repeat:null,locale:null,getModifierState:u,charCode:function(e){return"keypress"===e.type?a(e):0},keyCode:function(e){return"keydown"===e.type||"keyup"===e.type?e.keyCode:0},which:function(e){return"keypress"===e.type?a(e):"keydown"===e.type||"keyup"===e.type?e.keyCode:0}};o.augmentClass(r,s),e.exports=r},function(e,t,n){"use strict";function r(e){if(e.key){var t=a[e.key]||e.key;if("Unidentified"!==t)return t}if("keypress"===e.type){var n=o(e);return 13===n?"Enter":String.fromCharCode(n)}return"keydown"===e.type||"keyup"===e.type?i[e.keyCode]||"Unidentified":""}var o=n(74),a={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},i={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"};e.exports=r},function(e,t,n){"use strict";function r(e,t,n,r){return o.call(this,e,t,n,r)}var o=n(43),a={dataTransfer:null};o.augmentClass(r,a),e.exports=r},function(e,t,n){"use strict";function r(e,t,n,r){return o.call(this,e,t,n,r)}var o=n(34),a=n(63),i={touches:null,targetTouches:null,changedTouches:null,altKey:null,metaKey:null,ctrlKey:null,shiftKey:null,getModifierState:a};o.augmentClass(r,i),e.exports=r},function(e,t,n){"use strict";function r(e,t,n,r){return o.call(this,e,t,n,r)}var o=n(18),a={propertyName:null,elapsedTime:null,pseudoElement:null};o.augmentClass(r,a),e.exports=r},function(e,t,n){"use strict";function r(e,t,n,r){return o.call(this,e,t,n,r)}var o=n(43),a={deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:null,deltaMode:null};o.augmentClass(r,a),e.exports=r},function(e,t,n){"use strict";function r(e,t){var n={_topLevelWrapper:e,_idCounter:1,_ownerDocument:t?t.nodeType===o?t:t.ownerDocument:null,_node:t,_tag:t?t.nodeName.toLowerCase():null,_namespaceURI:t?t.namespaceURI:null};return n}var o=(n(73),9);e.exports=r},function(e,t,n){"use strict";var r={useCreateElement:!0,useFiber:!1};e.exports=r},function(e,t,n){"use strict";var r=n(256),o=/\/?>/,a=/^<\!\-\-/,i={CHECKSUM_ATTR_NAME:"data-react-checksum",addChecksumToMarkup:function(e){var t=r(e);return a.test(e)?e:e.replace(o," "+i.CHECKSUM_ATTR_NAME+'="'+t+'"$&')},canReuseMarkup:function(e,t){var n=t.getAttribute(i.CHECKSUM_ATTR_NAME);return n=n&&parseInt(n,10),r(e)===n}};e.exports=i},function(e,t,n){"use strict";function r(e){for(var t=1,n=0,r=0,a=e.length,i=-4&a;r<i;){for(var u=Math.min(r+4096,i);r<u;r+=4)n+=(t+=e.charCodeAt(r))+(t+=e.charCodeAt(r+1))+(t+=e.charCodeAt(r+2))+(t+=e.charCodeAt(r+3));t%=o,n%=o}for(;r<a;r++)n+=t+=e.charCodeAt(r);return t%=o,n%=o,t|n<<16}var o=65521;e.exports=r},function(e,t,n){"use strict";e.exports="15.6.1"},function(e,t,n){"use strict";function r(e){if(null==e)return null;if(1===e.nodeType)return e;var t=i.get(e);if(t)return t=u(t),t?a.getNodeFromInstance(t):null;"function"==typeof e.render?o("44"):o("45",Object.keys(e))}var o=n(3),a=(n(17),n(6)),i=n(35),u=n(123);n(1),n(2);e.exports=r},function(e,t,n){"use strict";var r=n(122);e.exports=r.renderSubtreeIntoContainer},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var o=n(0),a=r(o),i=n(10),u=n(8),s=n(310),l=r(s),c=function(e){var t=e.store;return a.default.createElement(i.Provider,{store:t},a.default.createElement(u.HashRouter,null,a.default.createElement(l.default,null)))};t.default=c},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function i(){var e,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"store",n=arguments[1],i=n||t+"Subscription",s=function(e){function n(a,i){r(this,n);var u=o(this,e.call(this,a,i));return u[t]=a.store,u}return a(n,e),n.prototype.getChildContext=function(){var e;return e={},e[t]=this[t],e[i]=null,e},n.prototype.render=function(){return u.Children.only(this.props.children)},n}(u.Component);return s.propTypes={store:c.a.isRequired,children:l.a.element.isRequired},s.childContextTypes=(e={},e[t]=c.a.isRequired,e[i]=c.b,e),s}t.a=i;var u=n(0),s=(n.n(u),n(5)),l=n.n(s),c=n(124);n(75);t.b=i()},function(e,t,n){"use strict";var r=n(11),o=n(1),a=n(96);e.exports=function(){function e(e,t,n,r,i,u){u!==a&&o(!1,"Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types")}function t(){return e}e.isRequired=e;var n={array:e,bool:e,func:e,number:e,object:e,string:e,symbol:e,any:e,arrayOf:t,element:e,instanceOf:t,node:e,objectOf:t,oneOf:t,oneOfType:t,shape:t};return n.checkPropTypes=r,n.PropTypes=n,n}},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(){var e=[],t=[];return{clear:function(){t=a,e=a},notify:function(){for(var n=e=t,r=0;r<n.length;r++)n[r]()},get:function(){return t},subscribe:function(n){var r=!0;return t===e&&(t=e.slice()),t.push(n),function(){r&&e!==a&&(r=!1,t===e&&(t=e.slice()),t.splice(t.indexOf(n),1))}}}}n.d(t,"a",function(){return u});var a=null,i={notify:function(){}},u=function(){function e(t,n,o){r(this,e),this.store=t,this.parentSub=n,this.onStateChange=o,this.unsubscribe=null,this.listeners=i}return e.prototype.addNestedSub=function(e){return this.trySubscribe(),this.listeners.subscribe(e)},e.prototype.notifyNestedSubs=function(){this.listeners.notify()},e.prototype.isSubscribed=function(){return Boolean(this.unsubscribe)},e.prototype.trySubscribe=function(){this.unsubscribe||(this.unsubscribe=this.parentSub?this.parentSub.addNestedSub(this.onStateChange):this.store.subscribe(this.onStateChange),this.listeners=o())},e.prototype.tryUnsubscribe=function(){this.unsubscribe&&(this.unsubscribe(),this.unsubscribe=null,this.listeners.clear(),this.listeners=i)},e}()},function(e,t,n){"use strict";function r(e,t){var n={};for(var r in e)t.indexOf(r)>=0||Object.prototype.hasOwnProperty.call(e,r)&&(n[r]=e[r]);return n}function o(e,t,n){for(var r=t.length-1;r>=0;r--){var o=t[r](e);if(o)return o}return function(t,r){throw new Error("Invalid value of type "+typeof e+" for "+n+" argument when connecting component "+r.wrappedComponentName+".")}}function a(e,t){return e===t}var i=n(125),u=n(265),s=n(266),l=n(281),c=n(282),f=n(283),p=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e};t.a=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=e.connectHOC,n=void 0===t?i.a:t,d=e.mapStateToPropsFactories,h=void 0===d?l.a:d,y=e.mapDispatchToPropsFactories,v=void 0===y?s.a:y,m=e.mergePropsFactories,g=void 0===m?c.a:m,b=e.selectorFactory,_=void 0===b?f.a:b;return function(e,t,i){var s=arguments.length>3&&void 0!==arguments[3]?arguments[3]:{},l=s.pure,c=void 0===l||l,f=s.areStatesEqual,d=void 0===f?a:f,y=s.areOwnPropsEqual,m=void 0===y?u.a:y,b=s.areStatePropsEqual,w=void 0===b?u.a:b,E=s.areMergedPropsEqual,O=void 0===E?u.a:E,P=r(s,["pure","areStatesEqual","areOwnPropsEqual","areStatePropsEqual","areMergedPropsEqual"]),C=o(e,h,"mapStateToProps"),x=o(t,v,"mapDispatchToProps"),k=o(i,g,"mergeProps");return n(_,p({methodName:"connect",getDisplayName:function(e){return"Connect("+e+")"},shouldHandleStateChanges:Boolean(e),initMapStateToProps:C,initMapDispatchToProps:x,initMergeProps:k,pure:c,areStatesEqual:d,areOwnPropsEqual:m,areStatePropsEqual:w,areMergedPropsEqual:O},P))}}()},function(e,t,n){"use strict";function r(e,t){return e===t?0!==e||0!==t||1/e==1/t:e!==e&&t!==t}function o(e,t){if(r(e,t))return!0;if("object"!=typeof e||null===e||"object"!=typeof t||null===t)return!1;var n=Object.keys(e),o=Object.keys(t);if(n.length!==o.length)return!1;for(var i=0;i<n.length;i++)if(!a.call(t,n[i])||!r(e[n[i]],t[n[i]]))return!1;return!0}t.a=o;var a=Object.prototype.hasOwnProperty},function(e,t,n){"use strict";function r(e){return"function"==typeof e?Object(u.b)(e,"mapDispatchToProps"):void 0}function o(e){return e?void 0:Object(u.a)(function(e){return{dispatch:e}})}function a(e){return e&&"object"==typeof e?Object(u.a)(function(t){return Object(i.bindActionCreators)(e,t)}):void 0}var i=n(47),u=n(131);t.a=[r,o,a]},function(e,t,n){"use strict";function r(e){return null==e?void 0===e?s:u:l&&l in Object(e)?Object(a.a)(e):Object(i.a)(e)}var o=n(128),a=n(270),i=n(271),u="[object Null]",s="[object Undefined]",l=o.a?o.a.toStringTag:void 0;t.a=r},function(e,t,n){"use strict";var r=n(269),o="object"==typeof self&&self&&self.Object===Object&&self,a=r.a||o||Function("return this")();t.a=a},function(e,t,n){"use strict";(function(e){var n="object"==typeof e&&e&&e.Object===Object&&e;t.a=n}).call(t,n(36))},function(e,t,n){"use strict";function r(e){var t=i.call(e,s),n=e[s];try{e[s]=void 0;var r=!0}catch(e){}var o=u.call(e);return r&&(t?e[s]=n:delete e[s]),o}var o=n(128),a=Object.prototype,i=a.hasOwnProperty,u=a.toString,s=o.a?o.a.toStringTag:void 0;t.a=r},function(e,t,n){"use strict";function r(e){return a.call(e)}var o=Object.prototype,a=o.toString;t.a=r},function(e,t,n){"use strict";var r=n(273),o=Object(r.a)(Object.getPrototypeOf,Object);t.a=o},function(e,t,n){"use strict";function r(e,t){return function(n){return e(t(n))}}t.a=r},function(e,t,n){"use strict";function r(e){return null!=e&&"object"==typeof e}t.a=r},function(e,t,n){e.exports=n(276)},function(e,t,n){"use strict";(function(e,r){Object.defineProperty(t,"__esModule",{value:!0});var o,a=n(277),i=function(e){return e&&e.__esModule?e:{default:e}}(a);o="undefined"!=typeof self?self:"undefined"!=typeof window?window:void 0!==e?e:r;var u=(0,i.default)(o);t.default=u}).call(t,n(36),n(37)(e))},function(e,t,n){"use strict";function r(e){var t,n=e.Symbol;return"function"==typeof n?n.observable?t=n.observable:(t=n("observable"),n.observable=t):t="@@observable",t}Object.defineProperty(t,"__esModule",{value:!0}),t.default=r},function(e,t,n){"use strict";function r(e,t){var n=t&&t.type;return"Given action "+(n&&'"'+n.toString()+'"'||"an action")+', reducer "'+e+'" returned undefined. To ignore an action, you must explicitly return the previous state. If you want this reducer to hold no value, you can return null instead of undefined.'}function o(e){Object.keys(e).forEach(function(t){var n=e[t];if(void 0===n(void 0,{type:i.a.INIT}))throw new Error('Reducer "'+t+"\" returned undefined during initialization. If the state passed to the reducer is undefined, you must explicitly return the initial state. The initial state may not be undefined. If you don't want to set a value for this reducer, you can use null instead of undefined.");if(void 0===n(void 0,{type:"@@redux/PROBE_UNKNOWN_ACTION_"+Math.random().toString(36).substring(7).split("").join(".")}))throw new Error('Reducer "'+t+"\" returned undefined when probed with a random type. Don't try to handle "+i.a.INIT+' or other actions in "redux/*" namespace. They are considered private. Instead, you must return the current state for any unknown actions, unless it is undefined, in which case you must return the initial state, regardless of the action type. The initial state may not be undefined, but can be null.')})}function a(e){for(var t=Object.keys(e),n={},a=0;a<t.length;a++){var i=t[a];"function"==typeof e[i]&&(n[i]=e[i])}var u=Object.keys(n),s=void 0;try{o(n)}catch(e){s=e}return function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=arguments[1];if(s)throw s;for(var o=!1,a={},i=0;i<u.length;i++){var l=u[i],c=n[l],f=e[l],p=c(f,t);if(void 0===p){var d=r(l,t);throw new Error(d)}a[l]=p,o=o||p!==f}return o?a:e}}t.a=a;var i=n(127);n(76),n(129)},function(e,t,n){"use strict";function r(e,t){return function(){return t(e.apply(void 0,arguments))}}function o(e,t){if("function"==typeof e)return r(e,t);if("object"!=typeof e||null===e)throw new Error("bindActionCreators expected an object or a function, instead received "+(null===e?"null":typeof e)+'. Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?');for(var n=Object.keys(e),o={},a=0;a<n.length;a++){var i=n[a],u=e[i];"function"==typeof u&&(o[i]=r(u,t))}return o}t.a=o},function(e,t,n){"use strict";function r(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];return function(e){return function(n,r,i){var u=e(n,r,i),s=u.dispatch,l=[],c={getState:u.getState,dispatch:function(e){return s(e)}};return l=t.map(function(e){return e(c)}),s=o.a.apply(void 0,l)(u.dispatch),a({},u,{dispatch:s})}}}t.a=r;var o=n(130),a=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}},function(e,t,n){"use strict";function r(e){return"function"==typeof e?Object(a.b)(e,"mapStateToProps"):void 0}function o(e){return e?void 0:Object(a.a)(function(){return{}})}var a=n(131);t.a=[r,o]},function(e,t,n){"use strict";function r(e,t,n){return u({},n,e,t)}function o(e){return function(t,n){var r=(n.displayName,n.pure),o=n.areMergedPropsEqual,a=!1,i=void 0;return function(t,n,u){var s=e(t,n,u);return a?r&&o(s,i)||(i=s):(a=!0,i=s),i}}}function a(e){return"function"==typeof e?o(e):void 0}function i(e){return e?void 0:function(){return r}}var u=(n(132),Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e});t.a=[a,i]},function(e,t,n){"use strict";function r(e,t){var n={};for(var r in e)t.indexOf(r)>=0||Object.prototype.hasOwnProperty.call(e,r)&&(n[r]=e[r]);return n}function o(e,t,n,r){return function(o,a){return n(e(o,a),t(r,a),a)}}function a(e,t,n,r,o){function a(o,a){return h=o,y=a,v=e(h,y),m=t(r,y),g=n(v,m,y),d=!0,g}function i(){return v=e(h,y),t.dependsOnOwnProps&&(m=t(r,y)),g=n(v,m,y)}function u(){return e.dependsOnOwnProps&&(v=e(h,y)),t.dependsOnOwnProps&&(m=t(r,y)),g=n(v,m,y)}function s(){var t=e(h,y),r=!p(t,v);return v=t,r&&(g=n(v,m,y)),g}function l(e,t){var n=!f(t,y),r=!c(e,h);return h=e,y=t,n&&r?i():n?u():r?s():g}var c=o.areStatesEqual,f=o.areOwnPropsEqual,p=o.areStatePropsEqual,d=!1,h=void 0,y=void 0,v=void 0,m=void 0,g=void 0;return function(e,t){return d?l(e,t):a(e,t)}}function i(e,t){var n=t.initMapStateToProps,i=t.initMapDispatchToProps,u=t.initMergeProps,s=r(t,["initMapStateToProps","initMapDispatchToProps","initMergeProps"]),l=n(e,s),c=i(e,s),f=u(e,s);return(s.pure?a:o)(l,c,f,e,s)}t.a=i;n(284)},function(e,t,n){"use strict";n(75)},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var i=n(7),u=n.n(i),s=n(0),l=n.n(s),c=n(5),f=n.n(c),p=n(286),d=n.n(p),h=n(79),y=function(e){function t(){var n,a,i;r(this,t);for(var u=arguments.length,s=Array(u),l=0;l<u;l++)s[l]=arguments[l];return n=a=o(this,e.call.apply(e,[this].concat(s))),a.history=d()(a.props),i=n,o(a,i)}return a(t,e),t.prototype.componentWillMount=function(){u()(!this.props.history,"<BrowserRouter> ignores the history prop. To use a custom history, use `import { Router }` instead of `import { BrowserRouter as Router }`.")},t.prototype.render=function(){return l.a.createElement(h.a,{history:this.history,children:this.props.children})},t}(l.a.Component);y.propTypes={basename:f.a.string,forceRefresh:f.a.bool,getUserConfirmation:f.a.func,keyLength:f.a.number,children:f.a.node},t.a=y},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},a=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},i=n(7),u=r(i),s=n(12),l=r(s),c=n(77),f=n(38),p=n(78),d=r(p),h=n(135),y=function(){try{return window.history.state||{}}catch(e){return{}}},v=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};(0,l.default)(h.canUseDOM,"Browser history needs a DOM");var t=window.history,n=(0,h.supportsHistory)(),r=!(0,h.supportsPopStateOnHashChange)(),i=e.forceRefresh,s=void 0!==i&&i,p=e.getUserConfirmation,v=void 0===p?h.getConfirmation:p,m=e.keyLength,g=void 0===m?6:m,b=e.basename?(0,f.stripTrailingSlash)((0,f.addLeadingSlash)(e.basename)):"",_=function(e){var t=e||{},n=t.key,r=t.state,o=window.location,a=o.pathname,i=o.search,s=o.hash,l=a+i+s;return(0,u.default)(!b||(0,f.hasBasename)(l,b),'You are attempting to use a basename on a page whose URL path does not begin with the basename. Expected path "'+l+'" to begin with "'+b+'".'),b&&(l=(0,f.stripBasename)(l,b)),(0,c.createLocation)(l,r,n)},w=function(){return Math.random().toString(36).substr(2,g)},E=(0,d.default)(),O=function(e){a(B,e),B.length=t.length,E.notifyListeners(B.location,B.action)},P=function(e){(0,h.isExtraneousPopstateEvent)(e)||k(_(e.state))},C=function(){k(_(y()))},x=!1,k=function(e){if(x)x=!1,O();else{E.confirmTransitionTo(e,"POP",v,function(t){t?O({action:"POP",location:e}):S(e)})}},S=function(e){var t=B.location,n=j.indexOf(t.key);-1===n&&(n=0);var r=j.indexOf(e.key);-1===r&&(r=0);var o=n-r;o&&(x=!0,I(o))},T=_(y()),j=[T.key],R=function(e){return b+(0,f.createPath)(e)},N=function(e,r){(0,u.default)(!("object"===(void 0===e?"undefined":o(e))&&void 0!==e.state&&void 0!==r),"You should avoid providing a 2nd state argument to push when the 1st argument is a location-like object that already has state; it is ignored");var a=(0,c.createLocation)(e,r,w(),B.location);E.confirmTransitionTo(a,"PUSH",v,function(e){if(e){var r=R(a),o=a.key,i=a.state;if(n)if(t.pushState({key:o,state:i},null,r),s)window.location.href=r;else{var l=j.indexOf(B.location.key),c=j.slice(0,-1===l?0:l+1);c.push(a.key),j=c,O({action:"PUSH",location:a})}else(0,u.default)(void 0===i,"Browser history cannot push state in browsers that do not support HTML5 history"),window.location.href=r}})},M=function(e,r){(0,u.default)(!("object"===(void 0===e?"undefined":o(e))&&void 0!==e.state&&void 0!==r),"You should avoid providing a 2nd state argument to replace when the 1st argument is a location-like object that already has state; it is ignored");var a=(0,c.createLocation)(e,r,w(),B.location);E.confirmTransitionTo(a,"REPLACE",v,function(e){if(e){var r=R(a),o=a.key,i=a.state;if(n)if(t.replaceState({key:o,state:i},null,r),s)window.location.replace(r);else{var l=j.indexOf(B.location.key);-1!==l&&(j[l]=a.key),O({action:"REPLACE",location:a})}else(0,u.default)(void 0===i,"Browser history cannot replace state in browsers that do not support HTML5 history"),window.location.replace(r)}})},I=function(e){t.go(e)},A=function(){return I(-1)},D=function(){return I(1)},L=0,U=function(e){L+=e,1===L?((0,h.addEventListener)(window,"popstate",P),r&&(0,h.addEventListener)(window,"hashchange",C)):0===L&&((0,h.removeEventListener)(window,"popstate",P),r&&(0,h.removeEventListener)(window,"hashchange",C))},F=!1,V=function(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0],t=E.setPrompt(e);return F||(U(1),F=!0),function(){return F&&(F=!1,U(-1)),t()}},W=function(e){var t=E.appendListener(e);return U(1),function(){U(-1),t()}},B={length:t.length,action:"POP",location:T,createHref:R,push:N,replace:M,go:I,goBack:A,goForward:D,block:V,listen:W};return B};t.default=v},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var i=n(7),u=n.n(i),s=n(0),l=n.n(s),c=n(5),f=n.n(c),p=n(288),d=n.n(p),h=n(79),y=function(e){function t(){var n,a,i;r(this,t);for(var u=arguments.length,s=Array(u),l=0;l<u;l++)s[l]=arguments[l];return n=a=o(this,e.call.apply(e,[this].concat(s))),a.history=d()(a.props),i=n,o(a,i)}return a(t,e),t.prototype.componentWillMount=function(){u()(!this.props.history,"<HashRouter> ignores the history prop. To use a custom history, use `import { Router }` instead of `import { HashRouter as Router }`.")},t.prototype.render=function(){return l.a.createElement(h.a,{history:this.history,children:this.props.children})},t}(l.a.Component);y.propTypes={basename:f.a.string,getUserConfirmation:f.a.func,hashType:f.a.oneOf(["hashbang","noslash","slash"]),children:f.a.node},t.a=y},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var o=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},a=n(7),i=r(a),u=n(12),s=r(u),l=n(77),c=n(38),f=n(78),p=r(f),d=n(135),h={hashbang:{encodePath:function(e){return"!"===e.charAt(0)?e:"!/"+(0,c.stripLeadingSlash)(e)},decodePath:function(e){return"!"===e.charAt(0)?e.substr(1):e}},noslash:{encodePath:c.stripLeadingSlash,decodePath:c.addLeadingSlash},slash:{encodePath:c.addLeadingSlash,decodePath:c.addLeadingSlash}},y=function(){var e=window.location.href,t=e.indexOf("#");return-1===t?"":e.substring(t+1)},v=function(e){return window.location.hash=e},m=function(e){var t=window.location.href.indexOf("#");window.location.replace(window.location.href.slice(0,t>=0?t:0)+"#"+e)},g=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};(0,s.default)(d.canUseDOM,"Hash history needs a DOM");var t=window.history,n=(0,d.supportsGoWithoutReloadUsingHash)(),r=e.getUserConfirmation,a=void 0===r?d.getConfirmation:r,u=e.hashType,f=void 0===u?"slash":u,g=e.basename?(0,c.stripTrailingSlash)((0,c.addLeadingSlash)(e.basename)):"",b=h[f],_=b.encodePath,w=b.decodePath,E=function(){var e=w(y());return(0,i.default)(!g||(0,c.hasBasename)(e,g),'You are attempting to use a basename on a page whose URL path does not begin with the basename. Expected path "'+e+'" to begin with "'+g+'".'),g&&(e=(0,c.stripBasename)(e,g)),(0,l.createLocation)(e)},O=(0,p.default)(),P=function(e){o(z,e),z.length=t.length,O.notifyListeners(z.location,z.action)},C=!1,x=null,k=function(){var e=y(),t=_(e);if(e!==t)m(t);else{var n=E(),r=z.location;if(!C&&(0,l.locationsAreEqual)(r,n))return;if(x===(0,c.createPath)(n))return;x=null,S(n)}},S=function(e){if(C)C=!1,P();else{O.confirmTransitionTo(e,"POP",a,function(t){t?P({action:"POP",location:e}):T(e)})}},T=function(e){var t=z.location,n=M.lastIndexOf((0,c.createPath)(t));-1===n&&(n=0);var r=M.lastIndexOf((0,c.createPath)(e));-1===r&&(r=0);var o=n-r;o&&(C=!0,L(o))},j=y(),R=_(j);j!==R&&m(R);var N=E(),M=[(0,c.createPath)(N)],I=function(e){return"#"+_(g+(0,c.createPath)(e))},A=function(e,t){(0,i.default)(void 0===t,"Hash history cannot push state; it is ignored");var n=(0,l.createLocation)(e,void 0,void 0,z.location);O.confirmTransitionTo(n,"PUSH",a,function(e){if(e){var t=(0,c.createPath)(n),r=_(g+t);if(y()!==r){x=t,v(r);var o=M.lastIndexOf((0,c.createPath)(z.location)),a=M.slice(0,-1===o?0:o+1);a.push(t),M=a,P({action:"PUSH",location:n})}else(0,i.default)(!1,"Hash history cannot PUSH the same path; a new entry will not be added to the history stack"),P()}})},D=function(e,t){(0,i.default)(void 0===t,"Hash history cannot replace state; it is ignored");var n=(0,l.createLocation)(e,void 0,void 0,z.location);O.confirmTransitionTo(n,"REPLACE",a,function(e){if(e){var t=(0,c.createPath)(n),r=_(g+t);y()!==r&&(x=t,m(r));var o=M.indexOf((0,c.createPath)(z.location));-1!==o&&(M[o]=t),P({action:"REPLACE",location:n})}})},L=function(e){(0,i.default)(n,"Hash history go(n) causes a full page reload in this browser"),t.go(e)},U=function(){return L(-1)},F=function(){return L(1)},V=0,W=function(e){V+=e,1===V?(0,d.addEventListener)(window,"hashchange",k):0===V&&(0,d.removeEventListener)(window,"hashchange",k)},B=!1,q=function(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0],t=O.setPrompt(e);return B||(W(1),B=!0),function(){return B&&(B=!1,W(-1)),t()}},H=function(e){var t=O.appendListener(e);return W(1),function(){W(-1),t()}},z={length:t.length,action:"POP",location:N,createHref:I,push:A,replace:D,go:L,goBack:U,goForward:F,block:q,listen:H};return z};t.default=g},function(e,t,n){"use strict";var r=n(290);t.a=r.a},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var i=n(7),u=n.n(i),s=n(0),l=n.n(s),c=n(5),f=n.n(c),p=n(291),d=n.n(p),h=n(80),y=function(e){function t(){var n,a,i;r(this,t);for(var u=arguments.length,s=Array(u),l=0;l<u;l++)s[l]=arguments[l];return n=a=o(this,e.call.apply(e,[this].concat(s))),a.history=d()(a.props),i=n,o(a,i)}return a(t,e),t.prototype.componentWillMount=function(){u()(!this.props.history,"<MemoryRouter> ignores the history prop. To use a custom history, use `import { Router }` instead of `import { MemoryRouter as Router }`.")},t.prototype.render=function(){return l.a.createElement(h.a,{history:this.history,children:this.props.children})},t}(l.a.Component);y.propTypes={initialEntries:f.a.array,initialIndex:f.a.number,getUserConfirmation:f.a.func,keyLength:f.a.number,children:f.a.node},t.a=y},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},a=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},i=n(7),u=r(i),s=n(38),l=n(77),c=n(78),f=r(c),p=function(e,t,n){return Math.min(Math.max(e,t),n)},d=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=e.getUserConfirmation,n=e.initialEntries,r=void 0===n?["/"]:n,i=e.initialIndex,c=void 0===i?0:i,d=e.keyLength,h=void 0===d?6:d,y=(0,f.default)(),v=function(e){a(T,e),T.length=T.entries.length,y.notifyListeners(T.location,T.action)},m=function(){return Math.random().toString(36).substr(2,h)},g=p(c,0,r.length-1),b=r.map(function(e){return"string"==typeof e?(0,l.createLocation)(e,void 0,m()):(0,l.createLocation)(e,void 0,e.key||m())}),_=s.createPath,w=function(e,n){(0,u.default)(!("object"===(void 0===e?"undefined":o(e))&&void 0!==e.state&&void 0!==n),"You should avoid providing a 2nd state argument to push when the 1st argument is a location-like object that already has state; it is ignored");var r=(0,l.createLocation)(e,n,m(),T.location);y.confirmTransitionTo(r,"PUSH",t,function(e){if(e){var t=T.index,n=t+1,o=T.entries.slice(0);o.length>n?o.splice(n,o.length-n,r):o.push(r),v({action:"PUSH",location:r,index:n,entries:o})}})},E=function(e,n){(0,u.default)(!("object"===(void 0===e?"undefined":o(e))&&void 0!==e.state&&void 0!==n),"You should avoid providing a 2nd state argument to replace when the 1st argument is a location-like object that already has state; it is ignored");var r=(0,l.createLocation)(e,n,m(),T.location);y.confirmTransitionTo(r,"REPLACE",t,function(e){e&&(T.entries[T.index]=r,v({action:"REPLACE",location:r}))})},O=function(e){var n=p(T.index+e,0,T.entries.length-1),r=T.entries[n];y.confirmTransitionTo(r,"POP",t,function(e){e?v({action:"POP",location:r,index:n}):v()})},P=function(){return O(-1)},C=function(){return O(1)},x=function(e){var t=T.index+e;return t>=0&&t<T.entries.length},k=function(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0];return y.setPrompt(e)},S=function(e){return y.appendListener(e)},T={length:b.length,action:"POP",location:b[g],index:g,entries:b,createHref:_,push:w,replace:E,go:O,goBack:P,goForward:C,canGo:x,block:k,listen:S};return T};t.default=d},function(e,t,n){"use strict";function r(e,t){var n={};for(var r in e)t.indexOf(r)>=0||Object.prototype.hasOwnProperty.call(e,r)&&(n[r]=e[r]);return n}var o=n(0),a=n.n(o),i=n(5),u=n.n(i),s=n(137),l=n(136),c=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},f="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},p=function(e){var t=e.to,n=e.exact,o=e.strict,i=e.location,u=e.activeClassName,p=e.className,d=e.activeStyle,h=e.style,y=e.isActive,v=e.ariaCurrent,m=r(e,["to","exact","strict","location","activeClassName","className","activeStyle","style","isActive","ariaCurrent"]);return a.a.createElement(s.a,{path:"object"===(void 0===t?"undefined":f(t))?t.pathname:t,exact:n,strict:o,location:i,children:function(e){var n=e.location,r=e.match,o=!!(y?y(r,n):r);return a.a.createElement(l.a,c({to:t,className:o?[p,u].filter(function(e){return e}).join(" "):p,style:o?c({},h,d):h,"aria-current":o&&v},m))}})};p.propTypes={to:l.a.propTypes.to,exact:u.a.bool,strict:u.a.bool,location:u.a.object,activeClassName:u.a.string,className:u.a.string,activeStyle:u.a.object,style:u.a.object,isActive:u.a.func,ariaCurrent:u.a.oneOf(["page","step","location","true"])},p.defaultProps={activeClassName:"active",ariaCurrent:"true"},t.a=p},function(e,t,n){function r(e,t){for(var n,r=[],o=0,a=0,i="",u=t&&t.delimiter||"/";null!=(n=g.exec(e));){var c=n[0],f=n[1],p=n.index;if(i+=e.slice(a,p),a=p+c.length,f)i+=f[1];else{var d=e[a],h=n[2],y=n[3],v=n[4],m=n[5],b=n[6],_=n[7];i&&(r.push(i),i="");var w=null!=h&&null!=d&&d!==h,E="+"===b||"*"===b,O="?"===b||"*"===b,P=n[2]||u,C=v||m;r.push({name:y||o++,prefix:h||"",delimiter:P,optional:O,repeat:E,partial:w,asterisk:!!_,pattern:C?l(C):_?".*":"[^"+s(P)+"]+?"})}}return a<e.length&&(i+=e.substr(a)),i&&r.push(i),r}function o(e,t){return u(r(e,t))}function a(e){return encodeURI(e).replace(/[\/?#]/g,function(e){return"%"+e.charCodeAt(0).toString(16).toUpperCase()})}function i(e){return encodeURI(e).replace(/[?#]/g,function(e){return"%"+e.charCodeAt(0).toString(16).toUpperCase()})}function u(e){for(var t=new Array(e.length),n=0;n<e.length;n++)"object"==typeof e[n]&&(t[n]=new RegExp("^(?:"+e[n].pattern+")$"));return function(n,r){for(var o="",u=n||{},s=r||{},l=s.pretty?a:encodeURIComponent,c=0;c<e.length;c++){var f=e[c];if("string"!=typeof f){var p,d=u[f.name];if(null==d){if(f.optional){f.partial&&(o+=f.prefix);continue}throw new TypeError('Expected "'+f.name+'" to be defined')}if(m(d)){if(!f.repeat)throw new TypeError('Expected "'+f.name+'" to not repeat, but received `'+JSON.stringify(d)+"`");if(0===d.length){if(f.optional)continue;throw new TypeError('Expected "'+f.name+'" to not be empty')}for(var h=0;h<d.length;h++){if(p=l(d[h]),!t[c].test(p))throw new TypeError('Expected all "'+f.name+'" to match "'+f.pattern+'", but received `'+JSON.stringify(p)+"`");o+=(0===h?f.prefix:f.delimiter)+p}}else{if(p=f.asterisk?i(d):l(d),!t[c].test(p))throw new TypeError('Expected "'+f.name+'" to match "'+f.pattern+'", but received "'+p+'"');o+=f.prefix+p}}else o+=f}return o}}function s(e){return e.replace(/([.+*?=^!:${}()[\]|\/\\])/g,"\\$1")}function l(e){return e.replace(/([=!:$\/()])/g,"\\$1")}function c(e,t){return e.keys=t,e}function f(e){return e.sensitive?"":"i"}function p(e,t){var n=e.source.match(/\((?!\?)/g);if(n)for(var r=0;r<n.length;r++)t.push({name:r,prefix:null,delimiter:null,optional:!1,repeat:!1,partial:!1,asterisk:!1,pattern:null});return c(e,t)}function d(e,t,n){for(var r=[],o=0;o<e.length;o++)r.push(v(e[o],t,n).source);return c(new RegExp("(?:"+r.join("|")+")",f(n)),t)}function h(e,t,n){return y(r(e,n),t,n)}function y(e,t,n){m(t)||(n=t||n,t=[]),n=n||{};for(var r=n.strict,o=!1!==n.end,a="",i=0;i<e.length;i++){var u=e[i];if("string"==typeof u)a+=s(u);else{var l=s(u.prefix),p="(?:"+u.pattern+")";t.push(u),u.repeat&&(p+="(?:"+l+p+")*"),p=u.optional?u.partial?l+"("+p+")?":"(?:"+l+"("+p+"))?":l+"("+p+")",a+=p}}var d=s(n.delimiter||"/"),h=a.slice(-d.length)===d;return r||(a=(h?a.slice(0,-d.length):a)+"(?:"+d+"(?=$))?"),a+=o?"$":r&&h?"":"(?="+d+"|$)",c(new RegExp("^"+a,f(n)),t)}function v(e,t,n){return m(t)||(n=t||n,t=[]),n=n||{},e instanceof RegExp?p(e,t):m(e)?d(e,t,n):h(e,t,n)}var m=n(294);e.exports=v,e.exports.parse=r,e.exports.compile=o,e.exports.tokensToFunction=u,e.exports.tokensToRegExp=y;var g=new RegExp(["(\\\\.)","([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))"].join("|"),"g")},function(e,t){e.exports=Array.isArray||function(e){return"[object Array]"==Object.prototype.toString.call(e)}},function(e,t,n){"use strict";var r=n(296);t.a=r.a},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var i=n(0),u=n.n(i),s=n(5),l=n.n(s),c=n(12),f=n.n(c),p=function(e){function t(){return r(this,t),o(this,e.apply(this,arguments))}return a(t,e),t.prototype.enable=function(e){this.unblock&&this.unblock(),this.unblock=this.context.router.history.block(e)},t.prototype.disable=function(){this.unblock&&(this.unblock(),this.unblock=null)},t.prototype.componentWillMount=function(){f()(this.context.router,"You should not use <Prompt> outside a <Router>"),this.props.when&&this.enable(this.props.message)},t.prototype.componentWillReceiveProps=function(e){e.when?this.props.when&&this.props.message===e.message||this.enable(e.message):this.disable()},t.prototype.componentWillUnmount=function(){this.disable()},t.prototype.render=function(){return null},t}(u.a.Component);p.propTypes={when:l.a.bool,message:l.a.oneOfType([l.a.func,l.a.string]).isRequired},p.defaultProps={when:!0},p.contextTypes={router:l.a.shape({history:l.a.shape({block:l.a.func.isRequired}).isRequired}).isRequired},t.a=p},function(e,t,n){"use strict";var r=n(298);t.a=r.a},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var i=n(0),u=n.n(i),s=n(5),l=n.n(s),c=n(7),f=n.n(c),p=n(12),d=n.n(p),h=n(299),y=function(e){function t(){return r(this,t),o(this,e.apply(this,arguments))}return a(t,e),t.prototype.isStatic=function(){return this.context.router&&this.context.router.staticContext},t.prototype.componentWillMount=function(){d()(this.context.router,"You should not use <Redirect> outside a <Router>"),this.isStatic()&&this.perform()},t.prototype.componentDidMount=function(){this.isStatic()||this.perform()},t.prototype.componentDidUpdate=function(e){var t=Object(h.a)(e.to),n=Object(h.a)(this.props.to);if(Object(h.b)(t,n))return void f()(!1,"You tried to redirect to the same route you're currently on: \""+n.pathname+n.search+'"');this.perform()},t.prototype.perform=function(){var e=this.context.router.history,t=this.props,n=t.push,r=t.to;n?e.push(r):e.replace(r)},t.prototype.render=function(){return null},t}(u.a.Component);y.propTypes={push:l.a.bool,from:l.a.string,to:l.a.oneOfType([l.a.string,l.a.object]).isRequired},y.defaultProps={push:!1},y.contextTypes={router:l.a.shape({history:l.a.shape({push:l.a.func.isRequired,replace:l.a.func.isRequired}).isRequired,staticContext:l.a.object}).isRequired},t.a=y},function(e,t,n){"use strict";var r=(n(300),n(301),n(302),n(48));n.d(t,"a",function(){return r.a}),n.d(t,"b",function(){return r.b});n(39)},function(e,t,n){"use strict";var r=n(7),o=(n.n(r),n(12));n.n(o),n(48),n(39),n(82),n(139),"function"==typeof Symbol&&Symbol.iterator,Object.assign},function(e,t,n){"use strict";var r=n(7),o=(n.n(r),n(12)),a=(n.n(o),n(48),n(39));n(82),n(139),Object.assign,a.f,a.a,a.a,a.a},function(e,t,n){"use strict";var r=n(7);n.n(r),n(39),n(48),n(82),"function"==typeof Symbol&&Symbol.iterator,Object.assign},function(e,t,n){"use strict";var r=n(304);t.a=r.a},function(e,t,n){"use strict";function r(e,t){var n={};for(var r in e)t.indexOf(r)>=0||Object.prototype.hasOwnProperty.call(e,r)&&(n[r]=e[r]);return n}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var u=n(7),s=n.n(u),l=n(12),c=n.n(l),f=n(0),p=n.n(f),d=n(5),h=n.n(d),y=n(38),v=(n.n(y),n(80)),m=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},g=function(e){var t=e.pathname,n=void 0===t?"/":t,r=e.search,o=void 0===r?"":r,a=e.hash,i=void 0===a?"":a;return{pathname:n,search:"?"===o?"":o,hash:"#"===i?"":i}},b=function(e,t){return e?m({},t,{pathname:Object(y.addLeadingSlash)(e)+t.pathname}):t},_=function(e,t){if(!e)return t;var n=Object(y.addLeadingSlash)(e);return 0!==t.pathname.indexOf(n)?t:m({},t,{pathname:t.pathname.substr(n.length)})},w=function(e){return"string"==typeof e?Object(y.parsePath)(e):g(e)},E=function(e){return"string"==typeof e?e:Object(y.createPath)(e)},O=function(e){return function(){c()(!1,"You cannot %s with <StaticRouter>",e)}},P=function(){},C=function(e){function t(){var n,r,i;o(this,t);for(var u=arguments.length,s=Array(u),l=0;l<u;l++)s[l]=arguments[l];return n=r=a(this,e.call.apply(e,[this].concat(s))),r.createHref=function(e){return Object(y.addLeadingSlash)(r.props.basename+E(e))},r.handlePush=function(e){var t=r.props,n=t.basename,o=t.context;o.action="PUSH",o.location=b(n,w(e)),o.url=E(o.location)},r.handleReplace=function(e){var t=r.props,n=t.basename,o=t.context;o.action="REPLACE",o.location=b(n,w(e)),o.url=E(o.location)},r.handleListen=function(){return P},r.handleBlock=function(){return P},i=n,a(r,i)}return i(t,e),t.prototype.getChildContext=function(){return{router:{staticContext:this.props.context}}},t.prototype.componentWillMount=function(){s()(!this.props.history,"<StaticRouter> ignores the history prop. To use a custom history, use `import { Router }` instead of `import { StaticRouter as Router }`.")},t.prototype.render=function(){var e=this.props,t=e.basename,n=(e.context,e.location),o=r(e,["basename","context","location"]),a={createHref:this.createHref,action:"POP",location:_(t,w(n)),push:this.handlePush,replace:this.handleReplace,go:O("go"),goBack:O("goBack"),goForward:O("goForward"),listen:this.handleListen,block:this.handleBlock};return p.a.createElement(v.a,m({},o,{history:a}))},t}(p.a.Component);C.propTypes={basename:h.a.string,context:h.a.object.isRequired,location:h.a.oneOfType([h.a.string,h.a.object])},C.defaultProps={basename:"",location:"/"},C.childContextTypes={router:h.a.object.isRequired},t.a=C},function(e,t,n){"use strict";var r=n(306);t.a=r.a},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var i=n(0),u=n.n(i),s=n(5),l=n.n(s),c=n(7),f=n.n(c),p=n(12),d=n.n(p),h=n(81),y=function(e){function t(){return r(this,t),o(this,e.apply(this,arguments))}return a(t,e),t.prototype.componentWillMount=function(){d()(this.context.router,"You should not use <Switch> outside a <Router>")},t.prototype.componentWillReceiveProps=function(e){f()(!(e.location&&!this.props.location),'<Switch> elements should not change from uncontrolled to controlled (or vice versa). You initially used no "location" prop and then provided one on a subsequent render.'),f()(!(!e.location&&this.props.location),'<Switch> elements should not change from controlled to uncontrolled (or vice versa). You provided a "location" prop initially but omitted it on a subsequent render.')},t.prototype.render=function(){var e=this.context.router.route,t=this.props.children,n=this.props.location||e.location,r=void 0,o=void 0;return u.a.Children.forEach(t,function(t){if(u.a.isValidElement(t)){var a=t.props,i=a.path,s=a.exact,l=a.strict,c=a.sensitive,f=a.from,p=i||f;null==r&&(o=t,r=p?Object(h.a)(n.pathname,{path:p,exact:s,strict:l,sensitive:c}):e.match)}}),r?u.a.cloneElement(o,{location:n,computedMatch:r}):null},t}(u.a.Component);y.contextTypes={router:l.a.shape({route:l.a.object.isRequired}).isRequired},y.propTypes={children:l.a.node,location:l.a.object},t.a=y},function(e,t,n){"use strict";var r=n(81);t.a=r.a},function(e,t,n){"use strict";var r=n(309);t.a=r.a},function(e,t,n){"use strict";function r(e,t){var n={};for(var r in e)t.indexOf(r)>=0||Object.prototype.hasOwnProperty.call(e,r)&&(n[r]=e[r]);return n}var o=n(0),a=n.n(o),i=n(5),u=n.n(i),s=n(126),l=n.n(s),c=n(138),f=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},p=function(e){var t=function(t){var n=t.wrappedComponentRef,o=r(t,["wrappedComponentRef"]);return a.a.createElement(c.a,{render:function(t){return a.a.createElement(e,f({},o,t,{ref:n}))}})};return t.displayName="withRouter("+(e.displayName||e.name)+")",t.WrappedComponent=e,t.propTypes={wrappedComponentRef:u.a.func},l()(t,e)};t.a=p},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var o=n(0),a=r(o),i=n(8),u=n(140),s=n(311),l=r(s),c=n(314),f=r(c),p=n(317),d=r(p),h=function(){return a.default.createElement("div",{className:"vbox viewport"},a.default.createElement(i.Switch,null,a.default.createElement(u.AuthRoute,{path:"/login",component:f.default}),a.default.createElement(u.AuthRoute,{path:"/signup",component:f.default}),a.default.createElement(u.AuthRoute,{path:"/splash",component:l.default}),a.default.createElement(u.ProtectedRoute,{path:"/",component:d.default})))};t.default=h},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(10),o=n(312),a=n(313),i=function(e){return e&&e.__esModule?e:{default:e}}(a),u=function(e){return{login_url:o.LOGIN_URL,signup_url:o.SIGNUP_URL}};t.default=(0,r.connect)(u)(i.default)},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.LOGIN_URL="/login",t.SIGNUP_URL="/signup"},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),u=n(0),s=function(e){return e&&e.__esModule?e:{default:e}}(u),l=(n(8),function(e){function t(e){r(this,t);var n=o(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.redirectToLogin=n.redirectToLogin.bind(n),n.redirectToSignup=n.redirectToSignup.bind(n),n}return a(t,e),i(t,[{key:"redirectToLogin",value:function(){this.props.history.push(this.props.login_url)}},{key:"redirectToSignup",value:function(){this.props.history.push(this.props.signup_url)}},{key:"render",value:function(){return s.default.createElement("div",{className:"splash"},s.default.createElement("div",{className:"hero-image"},s.default.createElement("div",{className:"splash-wrapper"},s.default.createElement("div",{className:"display-options"},s.default.createElement("div",{className:"left-most-options"},s.default.createElement("div",{className:"small-logo"},s.default.createElement("img",{alt:"",src:"https://open.scdn.co/static/images/logo-white-2x.png"})),s.default.createElement("button",{id:"signup-spotify",className:"btn btn-xl btn-green",onClick:this.redirectToSignup},"Sign Up"),s.default.createElement("div",{className:"separator-container"},s.default.createElement("div",{className:"separator-line"}),s.default.createElement("div",{className:"separator-line"})),s.default.createElement("button",{className:"btn btn-xl btn-white",onClick:this.redirectToLogin},"Login")),s.default.createElement("div",{className:"right-most-options"},s.default.createElement("h1",{className:"green-h1"},"Get the right music, right now"),s.default.createElement("h3",null,"Listen to millions of songs for free."),s.default.createElement("ul",null,s.default.createElement("li",null,"Search & discover music you'll love"),s.default.createElement("li",null,"Create playlists of your favorite music")))))))}}]),t}(s.default.Component));t.default=l},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(10),o=n(20),a=n(316),i=function(e){return e&&e.__esModule?e:{default:e}}(a),u=function(e){return{errors:e.errors.session,loggedIn:e.session.currentUser}},s=function(e,t){var n=t.location,r=n.pathname.slice(1),a="login"===r?o.login:o.signup;return{formType:r,formAction:function(t){return e(a(t))},demoLogin:function(t){return e((0,o.login)(t))},receiveErrors:function(t){return e((0,o.receiveSessionErrors)(t))}}};t.default=(0,r.connect)(u,s)(i.default)},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.signup=function(e){return $.ajax({method:"POST",url:"api/users",data:{user:e}})},t.login=function(e){return $.ajax({method:"POST",url:"api/session",data:{user:e}})},t.logout=function(e){return $.ajax({method:"DELETE",url:"api/session"})}},function(e,t,n){"use strict";function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var u=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),s=n(0),l=function(e){return e&&e.__esModule?e:{default:e}}(s),c=n(8),f=function(e){function t(e){o(this,t);var n=a(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.state={username:"",password:"",email:""},n.handleSubmit=n.handleSubmit.bind(n),n.handleDemoLogin=n.handleDemoLogin.bind(n),n}return i(t,e),u(t,[{key:"componentDidMount",value:function(){this.props.receiveErrors([])}},{key:"componentWillReceiveProps",value:function(e){e.loggedIn&&this.props.history.push("/"),e.location.pathname!==this.props.location.pathname&&this.props.receiveErrors([]),clearTimeout(this.clearInterval)}},{key:"componentWillUnmount",value:function(){clearTimeout(this.clearInterval)}},{key:"handleSubmit",value:function(e){e.preventDefault();var t=this.state;this.props.formAction(t)}},{key:"handleDemoLogin",value:function(e){var t=this;e.preventDefault();var n={username:"sys-g",password:"password"};this.setState({username:"",password:""});var r=Array.from("sys-g"),o=Array.from("password");this.clearInterval=setInterval(function(){r.length?t.setState({username:t.state.username+r.shift()}):o.length?t.setState({password:t.state.password+o.shift()}):(clearTimeout(t.clearInterval),t.props.demoLogin(n))},100)}},{key:"handleChange",value:function(e){var t=this;return function(n){return t.setState(r({},e,n.target.value))}}},{key:"renderErrors",value:function(){return l.default.createElement("div",{className:"error-container"},l.default.createElement("ul",null,this.props.errors.map(function(e,t){return l.default.createElement("li",{key:"error-"+t},e)})))}},{key:"render",value:function(){var e=this.state,t=e.username,n=e.password,r=e.email,o="login"!==this.props.formType,a=o?"Sign up":"Login";return l.default.createElement("div",{className:"splash"},l.default.createElement("div",{className:"hero-image"},l.default.createElement("div",{className:"session-form-wrapper"},l.default.createElement("div",{className:"display-options"},l.default.createElement("div",{className:"left-most-options"},l.default.createElement("div",{className:"extra-small-logo"},l.default.createElement(c.Link,{to:"/"},l.default.createElement("img",{alt:"",src:"https://open.scdn.co/static/images/logo-white-2x.png"}))),l.default.createElement("div",{className:"separator-container"},l.default.createElement("div",{className:"separator-line"}),l.default.createElement("div",{className:"separator-line"})),l.default.createElement("div",{className:"session-container"},this.renderErrors(),l.default.createElement("form",{className:"session-form",onSubmit:this.handleSubmit},l.default.createElement("input",{type:"text",id:"username-input",placeholder:"Username",value:t,onChange:this.handleChange("username")}),o&&l.default.createElement("input",{type:"text",placeholder:"Email",value:r,onChange:this.handleChange("email")}),l.default.createElement("input",{type:"password",value:n,onChange:this.handleChange("password"),placeholder:"Password"}),l.default.createElement("input",{className:"btn btn-green btn-xl",type:"submit",value:a}),l.default.createElement("button",{onClick:this.handleDemoLogin,className:"btn btn-xl btn-white","data-or":"or"},"Demo Login")),l.default.createElement("div",null,o?l.default.createElement("div",null,l.default.createElement("p",null,"Already have an account?"),l.default.createElement(c.Link,{className:"green-link",to:"/login"},"Log in")):l.default.createElement("div",null,l.default.createElement("p",null,"Don't have an account?"),l.default.createElement(c.Link,{className:"green-link",to:"/signup"},"Sign Up")))))))))}}]),t}(l.default.Component);t.default=(0,c.withRouter)(f)},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(10),o=n(20),a=n(318),i=function(e){return e&&e.__esModule?e:{default:e}}(a),u=function(e){return{currentUser:e.session.currentUser}},s=function(e){return{logout:function(){return e((0,o.logout)())}}};t.default=(0,r.connect)(u,s)(i.default)},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var u=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),s=n(0),l=r(s),c=n(319),f=r(c),p=n(324),d=r(p),h=n(424),y=r(h),v=function(e){function t(e){return o(this,t),a(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))}return i(t,e),u(t,[{key:"componentDidMount",value:function(){"/"===this.props.location.pathname&&this.props.history.push("/collection/playlists")}},{key:"render",value:function(){return l.default.createElement("div",{className:"vbox viewport main-container"},l.default.createElement("section",{className:"main-section-flex-container"},l.default.createElement("nav",{className:"nav-bar-flex-item"},l.default.createElement(f.default,null)),l.default.createElement("article",{className:"main-playground-flex-item"},l.default.createElement(d.default,null))),l.default.createElement("footer",{className:"media-player-flex-item",style:{color:"white"}},l.default.createElement(y.default,null)))}}]),t}(l.default.Component);t.default=v},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(10),o=n(8),a=n(320),i=function(e){return e&&e.__esModule?e:{default:e}}(a),u=n(20),s=n(15),l=function(e){return{currentUser:e.session.currentUser}},c=function(e){return{fetchPlaylists:function(){return e((0,s.fetchPlaylists)())},logout:function(){return e((0,u.logout)())}}};t.default=(0,o.withRouter)((0,r.connect)(l,c)(i.default))},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var u=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),s=n(0),l=r(s),c=(n(8),n(141)),f=r(c),p=n(321),d=r(p),h=n(322),y=r(h),v=function(e){function t(e){o(this,t);var n=a(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.handlePlaylistClick=n.handlePlaylistClick.bind(n),n.handleSearchClick=n.handleSearchClick.bind(n),n}return i(t,e),u(t,[{key:"handlePlaylistClick",value:function(){this.props.history.push("/collection/playlists")}},{key:"handleSearchClick",value:function(){this.props.history.push("/search/")}},{key:"render",value:function(){var e=this.props.currentUser;return l.default.createElement("div",{className:"vbox nav-container"},l.default.createElement("div",{className:"vbox nav-action-container"},l.default.createElement("div",{onClick:this.handlePlaylistClick,className:"hbox nav-brand-logo"},l.default.createElement("i",{className:"fa fa-spotify fa-2x"}),l.default.createElement("div",null,l.default.createElement("i",{className:"fa fa-spotifyasd","aria-hidden":"true"}))),l.default.createElement(f.default,null),l.default.createElement("div",{onClick:this.handleSearchClick,className:"hbox search-container"},l.default.createElement("div",{className:"search-text"},"Search"),l.default.createElement("div",{className:"search-logo"},l.default.createElement("i",{className:"fa fa-search strong"}))),l.default.createElement(f.default,null),l.default.createElement("div",{onClick:this.handlePlaylistClick,className:"hbox playlist-container"},l.default.createElement("div",null,"Playlists"),l.default.createElement("div",null,l.default.createElement("i",{className:"fa fa-music navlink-music-logo"})))),l.default.createElement(f.default,null),l.default.createElement("div",{className:"vbox about-me"},l.default.createElement(y.default,null)),l.default.createElement(f.default,null),l.default.createElement("div",{className:"vbox user-container"},l.default.createElement(d.default,{currentUser:e,logout:this.props.logout})))}}]),t}(l.default.Component);t.default=v},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(0),o=function(e){return e&&e.__esModule?e:{default:e}}(r),a=function(e){return o.default.createElement("div",{className:"hbox current-user-flex-container"},o.default.createElement("div",{className:"vbox current-user-image"},o.default.createElement("img",{src:e.currentUser.image_url})),o.default.createElement("div",{className:"hbox current-user-details"},o.default.createElement("div",{className:"vbox current-user-name"},e.currentUser.username),o.default.createElement("div",{onClick:function(){return e.logout()},className:"vbox current-user-logout-action"},o.default.createElement("i",{className:"fa fa-sign-out fa-2x"}))))};t.default=a},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(0),o=function(e){return e&&e.__esModule?e:{default:e}}(r),a=function(){return o.default.createElement("div",{className:"hbox about-me-flex-container"},o.default.createElement("div",{className:"vbox about-me-icons"},o.default.createElement("a",{target:"_blank",href:"https://github.com/AAlfarho/axo-music"},o.default.createElement("i",{className:"fa fa-github-square fa-2x brand-icons-fa"}))),o.default.createElement("div",{className:"hbox about-me-icons"},o.default.createElement("a",{target:"_blank",href:"https://www.linkedin.com/in/andrés-alfaro-cortés-b98b1b58/"},o.default.createElement("i",{className:"fa fa-linkedin-square fa-2x brand-icons-fa"}))))};t.default=a},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.fetchPlaylists=function(){return $.ajax({method:"GET",url:"api/playlists"})},t.fetchPlaylist=function(e){return $.ajax({method:"GET",url:"api/playlists/"+e})},t.createPlaylist=function(e){return $.ajax({method:"POST",url:"api/playlists",data:{playlist:e}})},t.updatePlaylist=function(e){return $.ajax({method:"PATCH",url:"api/playlists/"+e.id,data:{playlist:e}})},t.deletePlaylist=function(e){return $.ajax({method:"DELETE",url:"api/playlists/"+e})},t.followPlaylist=function(e){return $.ajax({method:"POST",url:"api/follow_playlist/"+e})},t.unfollowPlaylist=function(e){return $.ajax({method:"DELETE",url:"api/unfollow_playlist/"+e})}},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var o=n(0),a=r(o),i=n(8),u=n(140),s=n(325),l=r(s),c=n(338),f=r(c),p=n(412),d=r(p),h=function(){return a.default.createElement("div",{className:"vbox viewport"},a.default.createElement(i.Switch,null,a.default.createElement(u.ProtectedRoute,{path:"/collection/playlists",component:l.default}),a.default.createElement(u.ProtectedRoute,{path:"/search",component:d.default}),a.default.createElement(u.ProtectedRoute,{exact:!0,path:"/user/:userId/playlist/:playlistId",component:f.default}),a.default.createElement(u.ProtectedRoute,{exact:!0,path:"/user/:userId",component:l.default}),a.default.createElement(u.ProtectedRoute,{path:"/",component:l.default})))};t.default=h},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(10),o=n(8),a=(n(20),n(15)),i=n(29),u=n(327),s=function(e){return e&&e.__esModule?e:{default:e}}(u),l=function(e,t){var n=[],r=e.session.currentUser;return"/collection/playlists"!==t.match.path&&t.match.params.userId&&((r=e.users[t.match.params.userId])||(r={id:t.match.params.userId})),r&&(r.playlists_ids&&r.playlists_ids.forEach(function(t){e.playlists[t]&&n.push(e.playlists[t])}),r.follow_playlists_ids&&r.follow_playlists_ids.forEach(function(t){e.playlists[t]&&n.push(e.playlists[t])})),{playlists:n,userId:r.id,currentUser:e.session.currentUser,errors:e.errors.playlist,user:r}},c=function(e){return{fetchPlaylists:function(){return e((0,a.fetchPlaylists)())},fetchPlaylist:function(t){return e((0,a.fetchPlaylist)(t))},createPlaylist:function(t){return e((0,a.createPlaylist)(t))},fetchUser:function(t){return e((0,i.fetchUser)(t))}}};t.default=(0,o.withRouter)((0,r.connect)(l,c)(s.default))},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.friendUser=function(e){return $.ajax({method:"POST",url:"api/friend_user/"+e})},t.unfriendUser=function(e){return $.ajax({method:"DELETE",url:"api/unfriend_user/"+e})},t.fetchUser=function(e){return $.ajax({method:"GET",url:"api/users/"+e})}},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var u=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),s=n(0),l=r(s),c=n(83),f=r(c),p=n(146),d=r(p),h=n(335),y=r(h),v=n(84),m=n(336),g=r(m),b=function(e){function t(e){o(this,t);var n=a(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.state={newPlaylistModalOpen:!1},n.toggleNewPlaylistModal=n.toggleNewPlaylistModal.bind(n),n}return i(t,e),u(t,[{key:"toggleNewPlaylistModal",value:function(e){e&&(e.preventDefault(),this.setState(function(e){return{newPlaylistModalOpen:!e.newPlaylistModalOpen}}))}},{key:"componentWillMount",value:function(){var e=this.props,t=e.userId,n=e.currentUser;this.props.match.params.userId&&this.props.match.params.userId!==n.id?this.props.fetchUser(this.props.match.params.userId):t===n.id&&this.props.fetchPlaylists()}},{key:"componentWillReceiveProps",value:function(e){0===e.errors.length&&this.setState({newPlaylistModalOpen:!1}),this.props.userId!==e.userId&&(e.match.params.userId?this.props.fetchUser(e.match.params.userId):this.props.fetchPlaylists())}},{key:"render",value:function(){var e=this.props,t=e.userId,n=e.currentUser;e.user;return l.default.createElement("div",{className:"vbox viewport playlist-index-container"},l.default.createElement("div",{className:"hbox header-container"},l.default.createElement("div",{className:"vbox collection-owner-header"},l.default.createElement(g.default,null)),l.default.createElement("div",{className:"new-playlist-btn-container"},this.props.match.params.userId&&n.id===this.props.match.params.userId||t===n.id&&l.default.createElement("button",{className:"btn-sm btn-green btn-new-pl",onClick:this.toggleNewPlaylistModal}," New Playlist "))),this.newPlaylistModal(),l.default.createElement("div",{className:"hbox collection-playlist-container"},this.props.playlists.map(function(e){return l.default.createElement("div",{className:"playlist-media-info-item",key:"med-div-"+e.id},l.default.createElement(d.default,{key:"med-inf-"+e.id,collection:e}))})))}},{key:"newPlaylistModal",value:function(){return l.default.createElement("div",null,l.default.createElement(f.default,{isOpen:this.state.newPlaylistModalOpen,onAfterOpen:this.toggleNewPlaylistModal,onRequestClose:this.toggleNewPlaylistModal,style:v.formPLaylistModal,contentLabel:"new-playlist-modal"},l.default.createElement(y.default,{createPlaylist:this.props.createPlaylist})))}}]),t}(l.default.Component);t.default=b},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function u(e){return e()}Object.defineProperty(t,"__esModule",{value:!0}),t.bodyOpenClassName=t.portalClassName=void 0;var s=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},l=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),c=n(0),f=r(c),p=n(97),d=r(p),h=n(5),y=r(h),v=n(329),m=r(v),g=n(143),b=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}(g),_=n(145),w=r(_),E=t.portalClassName="ReactModalPortal",O=t.bodyOpenClassName="ReactModal__Body--open",P=d.default.unstable_renderSubtreeIntoContainer,C=function(e){function t(){var e,n,r,i;o(this,t);for(var l=arguments.length,c=Array(l),p=0;p<l;p++)c[p]=arguments[p];return n=r=a(this,(e=t.__proto__||Object.getPrototypeOf(t)).call.apply(e,[this].concat(c))),r.removePortal=function(){d.default.unmountComponentAtNode(r.node),u(r.props.parentSelector).removeChild(r.node)},r.renderPortal=function(e){r.portal=P(r,f.default.createElement(m.default,s({defaultStyles:t.defaultStyles},e)),r.node)},i=n,a(r,i)}return i(t,e),l(t,[{key:"componentDidMount",value:function(){this.node=document.createElement("div"),this.node.className=this.props.portalClassName,u(this.props.parentSelector).appendChild(this.node),this.renderPortal(this.props)}},{key:"componentWillReceiveProps",value:function(e){var t=e.isOpen;if(this.props.isOpen||t){var n=u(this.props.parentSelector),r=u(e.parentSelector);r!==n&&(n.removeChild(this.node),r.appendChild(this.node)),this.renderPortal(e)}}},{key:"componentWillUpdate",value:function(e){e.portalClassName!==this.props.portalClassName&&(this.node.className=e.portalClassName)}},{key:"componentWillUnmount",value:function(){if(this.node&&this.portal){var e=this.portal.state,t=Date.now(),n=e.isOpen&&this.props.closeTimeoutMS&&(e.closesAt||t+this.props.closeTimeoutMS);n?(e.beforeClose||this.portal.closeWithTimeout(),setTimeout(this.removePortal,n-t)):this.removePortal()}}},{key:"render",value:function(){return null}}],[{key:"setAppElement",value:function(e){b.setElement(e)}},{key:"injectCSS",value:function(){}}]),t}(c.Component);C.propTypes={isOpen:y.default.bool.isRequired,style:y.default.shape({content:y.default.object,overlay:y.default.object}),portalClassName:y.default.string,bodyOpenClassName:y.default.string,className:y.default.oneOfType([y.default.string,y.default.object]),overlayClassName:y.default.oneOfType([y.default.string,y.default.object]),appElement:y.default.instanceOf(w.default),onAfterOpen:y.default.func,onRequestClose:y.default.func,closeTimeoutMS:y.default.number,ariaHideApp:y.default.bool,shouldFocusAfter:y.default.bool,shouldCloseOnOverlayClick:y.default.bool,parentSelector:y.default.func,aria:y.default.object,role:y.default.string,contentLabel:y.default.string.isRequired},C.defaultProps={isOpen:!1,portalClassName:E,bodyOpenClassName:O,ariaHideApp:!0,closeTimeoutMS:0,shouldFocusAfterRender:!0,shouldCloseOnOverlayClick:!0,parentSelector:function(){return document.body}},C.defaultStyles={overlay:{position:"fixed",top:0,left:0,right:0,bottom:0,backgroundColor:"rgba(255, 255, 255, 0.75)"},content:{position:"absolute",top:"40px",left:"40px",right:"40px",bottom:"40px",border:"1px solid #ccc",background:"#fff",overflow:"auto",WebkitOverflowScrolling:"touch",borderRadius:"4px",outline:"none",padding:"20px"}},t.default=C},function(e,t,n){"use strict";function r(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}function o(e){return e&&e.__esModule?e:{default:e}}function a(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function u(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var s=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},l="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},c=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),f=n(0),p=o(f),d=n(5),h=n(330),y=r(h),v=n(331),m=o(v),g=n(143),b=r(g),_=n(144),w=r(_),E=n(332),O=r(E),P=n(145),C=o(P),x={overlay:"ReactModal__Overlay",content:"ReactModal__Content"},k=9,S=27,T=function(e){function t(e){a(this,t);var n=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.setFocusAfterRender=function(e){n.focusAfterRender=n.props.shouldFocusAfterRender&&e},n.setOverlayRef=function(e){n.overlay=e},n.setContentRef=function(e){n.content=e},n.afterClose=function(){y.returnFocus(),y.teardownScopedFocus()},n.open=function(){n.beforeOpen(),n.state.afterOpen&&n.state.beforeClose?(clearTimeout(n.closeTimer),n.setState({beforeClose:!1})):(y.setupScopedFocus(n.node),y.markForFocusLater(),n.setState({isOpen:!0},function(){n.setState({afterOpen:!0}),n.props.isOpen&&n.props.onAfterOpen&&n.props.onAfterOpen()}))},n.close=function(){n.beforeClose(),n.props.closeTimeoutMS>0?n.closeWithTimeout():n.closeWithoutTimeout()},n.focusContent=function(){return n.content&&!n.contentHasFocus()&&n.content.focus()},n.closeWithTimeout=function(){var e=Date.now()+n.props.closeTimeoutMS;n.setState({beforeClose:!0,closesAt:e},function(){n.closeTimer=setTimeout(n.closeWithoutTimeout,n.state.closesAt-Date.now())})},n.closeWithoutTimeout=function(){n.setState({beforeClose:!1,isOpen:!1,afterOpen:!1,closesAt:null},n.afterClose)},n.handleKeyDown=function(e){e.keyCode===k&&(0,m.default)(n.content,e),e.keyCode===S&&(e.preventDefault(),n.requestClose(e))},n.handleOverlayOnClick=function(e){null===n.shouldClose&&(n.shouldClose=!0),n.shouldClose&&n.props.shouldCloseOnOverlayClick&&(n.ownerHandlesClose()?n.requestClose(e):n.focusContent()),n.shouldClose=null},n.handleContentOnClick=function(){n.shouldClose=!1},n.handleContentOnMouseDown=function(){n.shouldClose=!1},n.requestClose=function(e){return n.ownerHandlesClose()&&n.props.onRequestClose(e)},n.ownerHandlesClose=function(){return n.props.onRequestClose},n.shouldBeClosed=function(){return!n.state.isOpen&&!n.state.beforeClose},n.contentHasFocus=function(){return document.activeElement===n.content||n.content.contains(document.activeElement)},n.buildClassName=function(e,t){var r="object"===(void 0===t?"undefined":l(t))?t:{base:x[e],afterOpen:x[e]+"--after-open",beforeClose:x[e]+"--before-close"},o=r.base;return n.state.afterOpen&&(o=o+" "+r.afterOpen),n.state.beforeClose&&(o=o+" "+r.beforeClose),"string"==typeof t&&t?o+" "+t:o},n.ariaAttributes=function(e){return Object.keys(e).reduce(function(t,n){return t["aria-"+n]=e[n],t},{})},n.state={afterOpen:!1,beforeClose:!1},n.shouldClose=null,n}return u(t,e),c(t,[{key:"componentDidMount",value:function(){this.props.isOpen&&(this.setFocusAfterRender(!0),this.open())}},{key:"componentWillReceiveProps",value:function(e){!this.props.isOpen&&e.isOpen?(this.setFocusAfterRender(!0),this.open()):this.props.isOpen&&!e.isOpen&&this.close()}},{key:"componentDidUpdate",value:function(){this.focusAfterRender&&(this.focusContent(),this.setFocusAfterRender(!1))}},{key:"componentWillUnmount",value:function(){this.beforeClose(),clearTimeout(this.closeTimer)}},{key:"beforeOpen",value:function(){var e=this.props,t=e.appElement,n=e.ariaHideApp,r=e.bodyOpenClassName;O.add(r),n&&b.hide(t)}},{key:"beforeClose",value:function(){var e=this.props,t=e.appElement,n=e.ariaHideApp,r=e.bodyOpenClassName;O.remove(r),n&&w.totalCount()<1&&b.show(t)}},{key:"render",value:function(){var e=this.props,t=e.className,n=e.overlayClassName,r=e.defaultStyles,o=t?{}:r.content,a=n?{}:r.overlay;return this.shouldBeClosed()?null:p.default.createElement("div",{ref:this.setOverlayRef,className:this.buildClassName("overlay",n),style:s({},a,this.props.style.overlay),onClick:this.handleOverlayOnClick},p.default.createElement("div",s({ref:this.setContentRef,style:s({},o,this.props.style.content),className:this.buildClassName("content",t),tabIndex:"-1",onKeyDown:this.handleKeyDown,onMouseDown:this.handleContentOnMouseDown,onClick:this.handleContentOnClick,role:this.props.role,"aria-label":this.props.contentLabel},this.ariaAttributes(this.props.aria||{})),this.props.children))}}]),t}(f.Component);T.defaultProps={style:{overlay:{},content:{}}},T.propTypes={isOpen:d.PropTypes.bool.isRequired,defaultStyles:d.PropTypes.shape({content:d.PropTypes.object,overlay:d.PropTypes.object}),style:d.PropTypes.shape({content:d.PropTypes.object,overlay:d.PropTypes.object}),className:d.PropTypes.oneOfType([d.PropTypes.string,d.PropTypes.object]),overlayClassName:d.PropTypes.oneOfType([d.PropTypes.string,d.PropTypes.object]),bodyOpenClassName:d.PropTypes.string,ariaHideApp:d.PropTypes.bool,appElement:d.PropTypes.instanceOf(C.default),onAfterOpen:d.PropTypes.func,onRequestClose:d.PropTypes.func,closeTimeoutMS:d.PropTypes.number,shouldFocusAfterRender:d.PropTypes.bool,shouldCloseOnOverlayClick:d.PropTypes.bool,role:d.PropTypes.string,contentLabel:d.PropTypes.string,aria:d.PropTypes.object,children:d.PropTypes.node},t.default=T,e.exports=t.default},function(e,t,n){"use strict";function r(){d=!0}function o(){if(d){if(d=!1,!p)return;setTimeout(function(){if(!p.contains(document.activeElement)){((0,c.default)(p)[0]||p).focus()}},0)}}function a(){f.push(document.activeElement)}function i(){var e=null;try{return e=f.pop(),void e.focus()}catch(t){console.warn(["You tried to return focus to",e,"but it is not in the DOM anymore"].join(" "))}}function u(e){p=e,window.addEventListener?(window.addEventListener("blur",r,!1),document.addEventListener("focus",o,!0)):(window.attachEvent("onBlur",r),document.attachEvent("onFocus",o))}function s(){p=null,window.addEventListener?(window.removeEventListener("blur",r),document.removeEventListener("focus",o)):(window.detachEvent("onBlur",r),document.detachEvent("onFocus",o))}Object.defineProperty(t,"__esModule",{value:!0}),t.handleBlur=r,t.handleFocus=o,t.markForFocusLater=a,t.returnFocus=i,t.setupScopedFocus=u,t.teardownScopedFocus=s;var l=n(142),c=function(e){return e&&e.__esModule?e:{default:e}}(l),f=[],p=null,d=!1},function(e,t,n){"use strict";function r(e,t){var n=(0,a.default)(e);if(!n.length)return void t.preventDefault();n[t.shiftKey?0:n.length-1]!==document.activeElement&&e!==document.activeElement||(t.preventDefault(),n[t.shiftKey?n.length-1:0].focus())}Object.defineProperty(t,"__esModule",{value:!0}),t.default=r;var o=n(142),a=function(e){return e&&e.__esModule?e:{default:e}}(o);e.exports=t.default},function(e,t,n){"use strict";function r(e){e.split(" ").map(i.add).forEach(function(e){return document.body.classList.add(e)})}function o(e){var t=i.get();e.split(" ").map(i.remove).filter(function(e){return 0===t[e]}).forEach(function(e){return document.body.classList.remove(e)})}Object.defineProperty(t,"__esModule",{value:!0}),t.add=r,t.remove=o;var a=n(144),i=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}(a)},function(e,t,n){var r;/*!
  Copyright (c) 2015 Jed Watson.
  Based on code that is Copyright 2013-2015, Facebook, Inc.
  All rights reserved.
*/
!function(){"use strict";var o=!("undefined"==typeof window||!window.document||!window.document.createElement),a={canUseDOM:o,canUseWorkers:"undefined"!=typeof Worker,canUseEventListeners:o&&!(!window.addEventListener&&!window.attachEvent),canUseViewport:o&&!!window.screen};void 0!==(r=function(){return a}.call(t,n,t,e))&&(e.exports=r)}()},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),u=n(0),s=function(e){return e&&e.__esModule?e:{default:e}}(u),l=n(8),c=function(e){function t(e){r(this,t);var n=o(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.handleReproduceCollection=n.handleReproduceCollection.bind(n),n}return a(t,e),i(t,[{key:"handleReproduceCollection",value:function(e){e.preventDefault(),this.props.collection.song_ids.length>0&&this.props.reproduceCollection(this.props.collection)}},{key:"render",value:function(){return s.default.createElement("div",{className:"vbox media-info-flex-container"},s.default.createElement("div",{onClick:this.handleReproduceCollection,className:"vbox media-info-image-container"},s.default.createElement("img",{src:this.props.image_url})),s.default.createElement("div",{className:"vbox media-info-footer"},s.default.createElement("div",{className:"media-info-link"},s.default.createElement(l.Link,{to:this.props.detail_url},this.props.media_name)),s.default.createElement("div",{className:"media-info-author"},s.default.createElement(l.Link,{to:this.props.author_url},"By: ",this.props.media_author_name))))}}]),t}(s.default.Component);t.default=c},function(e,t,n){"use strict";function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var u=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),s=n(0),l=function(e){return e&&e.__esModule?e:{default:e}}(s),c=function(e){function t(e){o(this,t);var n=a(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.state={playlistName:"",actionStatus:""},n.handlePlaylistCreation=n.handlePlaylistCreation.bind(n),n}return i(t,e),u(t,[{key:"componentDidMount",value:function(){document.getElementById("playlist-input").focus(),document.getElementById("playlist-input").addEventListener("keyup",function(e){e.preventDefault(),13==e.keyCode&&document.getElementById("add-button").click()})}},{key:"handleChange",value:function(e){var t=this;return function(n){t.setState(r({},e,n.target.value))}}},{key:"handlePlaylistCreation",value:function(){var e=this,t=this.state.playlistName;this.props.createPlaylist({name:t}).then(function(n){e.setState({actionStatus:"Playlist '"+t+"' created! "})},function(t){e.setState({actionStatus:t.errors})})}},{key:"render",value:function(){var e=this.state,t=e.playlistName,n=e.actionStatus;return l.default.createElement("div",{className:"vbox new-playlist-flex-container"},l.default.createElement("div",{className:"new-playlist-title"},l.default.createElement("h1",null,"Create new playlist")),l.default.createElement("div",{className:"hbox new-playlist-input"},l.default.createElement("input",{id:"playlist-input",type:"text",className:"modal-input-dark",value:t,onChange:this.handleChange("playlistName"),placeholder:"Start typing..."})),l.default.createElement("div",{name:"new-playlist-actions"},l.default.createElement("button",{id:"add-button",className:"btn-sm btn-xl-create-pl btn-green",onClick:this.handlePlaylistCreation},"Create")),l.default.createElement("div",{className:"new-playlist-res"},n))}}]),t}(l.default.Component);t.default=c},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(10),o=n(8),a=n(29),i=n(337),u=function(e){return e&&e.__esModule?e:{default:e}}(i),s=function(e,t){var n=e.session.currentUser;return t.match.params.userId&&((n=e.users[t.match.params.userId])||(n={id:t.match.params.userId})),{currentUser:e.session.currentUser,user:n}},l=function(e){return{friendUser:function(t){return e((0,a.friendUser)(t))},unfriendUser:function(t){return e((0,a.unfriendUser)(t))},fetchUser:function(t){return e((0,a.fetchUser)(t))}}};t.default=(0,o.withRouter)((0,r.connect)(s,l)(u.default))},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),u=n(0),s=function(e){return e&&e.__esModule?e:{default:e}}(u),l=function(e){function t(e){r(this,t);var n=o(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.handleFollowAction=n.handleFollowAction.bind(n),n.handleUnfollowAction=n.handleUnfollowAction.bind(n),n}return a(t,e),i(t,[{key:"componentWillMount",value:function(){this.props.user.username||this.props.fetchUser(this.props.user.id)}},{key:"handleFollowAction",value:function(){this.props.friendUser(this.props.user.id)}},{key:"handleUnfollowAction",value:function(){this.props.unfriendUser(this.props.user.id)}},{key:"render",value:function(){var e=this.props,t=e.user,n=e.currentUser;if(!t.username)return s.default.createElement("div",null);var r=void 0;return n.id!==t.id&&(r=t.user_friend?s.default.createElement("button",{className:"btn-sm btn-white btn-friend",onClick:this.handleUnfollowAction},"Unfollow"):s.default.createElement("button",{className:"btn-sm btn-green btn-friend",onClick:this.handleFollowAction},"Follow")),s.default.createElement("div",{className:"hbox user-thumb-flex-container"},s.default.createElement("div",{className:"vbox user-thumb-image-container"},s.default.createElement("img",{src:t.image_url})),s.default.createElement("div",{className:"vbox user-thumb-details-container"},s.default.createElement("div",{className:"hbox user-thumb-name-container"},t.username),s.default.createElement("div",{className:"hbox user-thumb-actions-cotainer"},r)))}}]),t}(s.default.Component);t.default=l},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(10),o=n(8),a=(n(20),n(15)),i=n(339),u=function(e){return e&&e.__esModule?e:{default:e}}(i),s=function(e,t){var n=e.playlists[t.match.params.playlistId],r=[];return n?n.song_ids.forEach(function(t){e.songs[t]&&r.push(e.songs[t])}):n={},{playlist:n,songs:r,state:e}},l=function(e){return{fetchPlaylist:function(t){return e((0,a.fetchPlaylist)(t))},updatePlaylist:function(t){return e((0,a.updatePlaylist)(t))},deletePlaylist:function(t){return e((0,a.deletePlaylist)(t))},followPlaylist:function(t){return e((0,a.followPlaylist)(t))},unfollowPlaylist:function(t){return e((0,a.unfollowPlaylist)(t))}}};t.default=(0,o.withRouter)((0,r.connect)(s,l)(u.default))},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var u=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),s=n(0),l=r(s),c=n(83),f=r(c),p=n(146),d=r(p),h=n(148),y=r(h),v=n(49),m=n(84),g=n(344),b=r(g),_=n(411),w=r(_),E=function(e){function t(e){o(this,t);var n=a(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.state={udpatePlaylistModalOpen:!1,deletePlaylistModalOpen:!1},n.toggleUpdatePlaylistModal=n.toggleUpdatePlaylistModal.bind(n),n.toggleDeletePlaylistModal=n.toggleDeletePlaylistModal.bind(n),n}return i(t,e),u(t,[{key:"componentWillMount",value:function(){this.props.fetchPlaylist(this.props.match.params.playlistId)}},{key:"componentWillReceiveProps",value:function(e){var t=this.props.match.params.playlistId,n=e.match.params.playlistId;t&&n&&t!==n&&this.props.fetchPlaylist(e.match.params.playlistId),0===e.state.errors.playlist.length&&this.setState({udpatePlaylistModalOpen:!1,deletePlaylistModalOpen:!1})}},{key:"toggleUpdatePlaylistModal",value:function(e){e&&(e.preventDefault(),this.setState(function(e){return{udpatePlaylistModalOpen:!e.udpatePlaylistModalOpen}}))}},{key:"toggleDeletePlaylistModal",value:function(e){e&&(e.preventDefault(),this.setState(function(e){return{deletePlaylistModalOpen:!e.deletePlaylistModalOpen}}))}},{key:"render",value:function(){var e=this,t=this.props,n=t.playlist,r=t.songs,o=void 0;return o=n.user_owns?l.default.createElement("div",{className:"hbox playlist-owner-actions"},l.default.createElement("button",{className:"btn-sm btn-green btn-owner-actions-pl",onClick:this.toggleUpdatePlaylistModal},"Rename"),l.default.createElement("button",{className:"btn-sm btn-white btn-owner-actions-pl",onClick:this.toggleDeletePlaylistModal},"Delete")):n.user_follows?l.default.createElement("div",{className:"hbox playlist-followee-actions"},l.default.createElement("button",{className:"btn-sm btn-white btn-owner-actions-pl",onClick:function(){return e.props.unfollowPlaylist(n.id)}},"Unfollow")):l.default.createElement("div",{className:"hbox playlist-followee-actions"},l.default.createElement("button",{className:"btn-sm btn-green btn-owner-actions-pl",onClick:function(){return e.props.followPlaylist(n.id)}},"Follow")),l.default.createElement("div",{className:"hbox playlist-detail-flex-container"},l.default.createElement("div",{className:"vbox playlist-media-info-container"},l.default.createElement(d.default,{collection:n}),this.updatePlaylistModal(),this.deletePlaylistModal(),o),l.default.createElement("div",{className:"playlist-song-index-container vieport"},l.default.createElement(y.default,{collectionType:v.PLAYLIST_COLLECTION,collection:n,songs:Object.values(r)})))}},{key:"updatePlaylistModal",value:function(){return l.default.createElement(f.default,{isOpen:this.state.udpatePlaylistModalOpen,onAfterOpen:this.toggleUpdatePlaylistModal,onRequestClose:this.toggleUpdatePlaylistModal,style:m.formPLaylistModal,contentLabel:"update-pl"},l.default.createElement(b.default,{updatePlaylist:this.props.updatePlaylist,playlist:this.props.playlist}))}},{key:"deletePlaylistModal",value:function(){return l.default.createElement(f.default,{isOpen:this.state.deletePlaylistModalOpen,onAfterOpen:this.toggleDeletePlaylistModal,onRequestClose:this.toggleDeletePlaylistModal,style:m.formPLaylistModal,contentLabel:"delete-song-from-pl"},l.default.createElement(w.default,{history:this.props.history,deletePlaylist:this.props.deletePlaylist,playlist:this.props.playlist}))}}]),t}(l.default.Component);t.default=E},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var u=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),s=n(0),l=r(s),c=n(341),f=r(c),p=function(e){function t(){return o(this,t),a(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return i(t,e),u(t,[{key:"componentWillMount",value:function(){this.props.fetchPlaylists()}},{key:"render",value:function(){var e=this;return l.default.createElement("div",{className:"vbox song-index-flex-container viewport"},this.props.songs.map(function(t,n){return l.default.createElement(f.default,{key:t.id,song:t,showDelete:e.props.showDelete,collection:e.props.collection,collectionType:e.props.collectionType,updatePlaylist:e.props.updatePlaylist})}))}}]),t}(l.default.Component);t.default=p},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function u(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var s=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),l=n(0),c=r(l),f=n(49),p=n(83),d=r(p),h=n(342),y=r(h),v=n(84),m=n(149),g=function(e){function t(e){a(this,t);var n=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.handleDeleteSong=n.handleDeleteSong.bind(n),n.toggleSongOptModal=n.toggleSongOptModal.bind(n),n.toggleAddSongModal=n.toggleAddSongModal.bind(n),n.toggleModal=n.toggleModal.bind(n),n.state={deleteSongModalOpen:!1,addSongToCollectionModalOpen:!1},n}return u(t,e),s(t,[{key:"toggleModal",value:function(e){var t=this;return function(n){t.setState(function(t){return o({},e,!t[e])})}}},{key:"toggleSongOptModal",value:function(e){e&&(e.preventDefault(),this.setState(function(e){return{deleteSongModalOpen:!e.deleteSongModalOpen}}))}},{key:"toggleAddSongModal",value:function(e){e&&(e.preventDefault(),this.setState(function(e){return{addSongToCollectionModalOpen:!e.addSongToCollectionModalOpen}}))}},{key:"handleDeleteSong",value:function(e){if(this.props.collectionType===f.PLAYLIST_COLLECTION){var t=this.props.collection.song_ids,n=t.indexOf(this.props.song.id);-1!==n&&(t.splice(n,1),0===t.length&&t.push(""),this.props.updatePlaylist(this.props.collection))}this.toggleSongOptModal(e)}},{key:"songOptionsModal",value:function(){var e=this.props,t=e.song,n=e.collection;return c.default.createElement(d.default,{isOpen:this.state.deleteSongModalOpen,onAfterOpen:this.toggleSongOptModal,onRequestClose:this.toggleSongOptModal,style:v.formPLaylistModal,contentLabel:"song-opt-modal"},c.default.createElement("div",{className:"vbox delete-playlist-flex-container"},c.default.createElement("div",{className:"new-playlist-title"},c.default.createElement("h1",null,"Delete ","'"+t.title+"'"," from ","'"+n.name+"'","?")),c.default.createElement("div",{name:"new-playlist-actions"},c.default.createElement("button",{className:"btn-sm btn-xl-create-pl btn-green",onClick:this.handleDeleteSong},"Delete"))))}},{key:"addToPlaylistModal",value:function(){return c.default.createElement(d.default,{isOpen:this.state.addSongToCollectionModalOpen,onAfterOpen:this.toggleAddSongModal,onRequestClose:this.toggleAddSongModal,style:v.formPLaylistModal,contentLabel:"add-to-pl-modal"},c.default.createElement(y.default,{song_id:this.props.song.id}))}},{key:"render",value:function(){var e=this.props,t=(e.collection,e.song),n=e.showDelete;return c.default.createElement("div",{className:"hbox song-item-flex-cotainer"},this.songOptionsModal(),this.addToPlaylistModal(),c.default.createElement("div",{className:"vbox song-detail-items"},c.default.createElement("div",{className:"hbox song-title-container"},t.title),c.default.createElement("div",{className:"hbox song-details"},c.default.createElement("div",{className:"vbox song-detail-artist-name"},"Artist: ",t.artist_name),c.default.createElement("div",{className:"vbox song-detail-album-name"},"Album: ",t.album_name),c.default.createElement("div",{className:"hbox song-right-details"},c.default.createElement("div",{className:"vbox duration-detail"},(0,m.formatSeconds)(t.length)),c.default.createElement("div",{className:"hbox menu-options"},c.default.createElement("div",{className:"vbox pl-detail-add-song",onClick:this.toggleAddSongModal},c.default.createElement("i",{className:"fa fa-plus-square-o fa-2x"})),n&&c.default.createElement("div",{className:"vbox pl-detail-delete-song",onClick:this.toggleSongOptModal},c.default.createElement("i",{className:"fa fa-minus-square-o fa-2x"})))))))}}]),t}(c.default.Component);t.default=g},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(10),o=n(15),a=n(343),i=function(e){return e&&e.__esModule?e:{default:e}}(a),u=function(e,t){var n=e.session.currentUser.playlists_ids,r=[];return n.forEach(function(t){return r.push(e.playlists[t])}),{playlists:r,song_id:t.song_id}},s=function(e){return{updatePlaylist:function(t){return e((0,o.updatePlaylist)(t))},fetchPlaylists:function(){return e((0,o.fetchPlaylists)())}}};t.default=(0,r.connect)(u,s)(i.default)},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var u=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),s=n(0),l=r(s),c=n(141),f=r(c),p=function(e){function t(e){o(this,t);var n=a(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.addSongToPlaylist=n.addSongToPlaylist.bind(n),n.state={addStatusLabel:""},n}return i(t,e),u(t,[{key:"addSongToPlaylist",value:function(e){var t=this;e.preventDefault();var n=this.props,r=n.playlists,o=n.song_id,a=parseInt(e.target.id),i=void 0;r.forEach(function(e){e.id===a&&(i=e)}),i.song_ids.push(o),this.props.updatePlaylist(i).then(function(e){return t.setState({addStatusLabel:"Song added to playlist: '"+i.name+"' !"})})}},{key:"render",value:function(){var e=this,t=this.props.playlists;return l.default.createElement("div",{className:"vbox new-playlist-flex-container"},l.default.createElement("div",{className:"new-playlist-title"},l.default.createElement("h1",null,"Add to playlist")),l.default.createElement("div",{className:"new-playlist-input"},t.map(function(t){return l.default.createElement("div",{key:"pl-"+t.id,className:"select-playlist-to-add-song",onClick:e.addSongToPlaylist},l.default.createElement("div",{id:t.id,className:"playlist-to-add-name"},t.name),l.default.createElement(f.default,null))}),l.default.createElement("div",{className:"hbox song-add-to-pl-res-container"},l.default.createElement("div",{className:"song-add-to-pl-res"},this.state.addStatusLabel))))}}]),t}(l.default.Component);t.default=p},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var u=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),s=n(0),l=r(s),c=n(21),f=r(c),p=function(e){function t(e){o(this,t);var n=a(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e)),r=n.props.playlist;return n.state={playlist:r,actionStatus:""},n.handlePlaylistUpdate=n.handlePlaylistUpdate.bind(n),n.handleTitleChange=n.handleTitleChange.bind(n),n}return i(t,e),u(t,[{key:"componentDidMount",value:function(){document.getElementById("playlist-input").focus(),document.getElementById("playlist-input").addEventListener("keyup",function(e){e.preventDefault(),13==e.keyCode&&document.getElementById("update-button").click()})}},{key:"handleTitleChange",value:function(e){var t=e.target.value,n=(0,f.default)({},this.state);n.playlist.name=t,this.setState(n)}},{key:"handlePlaylistUpdate",value:function(){var e=this;this.state.playlist;this.props.updatePlaylist(this.state.playlist).fail(function(t){e.setState({actionStatus:t.errors})})}},{key:"render",value:function(){var e=this.state,t=e.playlist,n=e.actionStatus;return l.default.createElement("div",{className:"vbox new-playlist-flex-container"},l.default.createElement("div",{className:"new-playlist-title"},l.default.createElement("h1",null,"Update Playlist")),l.default.createElement("div",{className:"hbox new-playlist-input"},l.default.createElement("input",{id:"playlist-input",type:"text",className:"modal-input-dark",value:t.name,onChange:this.handleTitleChange,placeholder:"Start typing..."})),l.default.createElement("div",{name:"new-playlist-actions"},l.default.createElement("button",{id:"update-button",className:"btn-sm btn-xl-create-pl btn-green",onClick:this.handlePlaylistUpdate},"Rename")),l.default.createElement("div",{className:"update-playlist-res"},n))}}]),t}(l.default.Component);t.default=p},function(e,t,n){function r(e,t,n,c,f){e!==t&&i(t,function(i,l){if(s(i))f||(f=new o),u(e,t,l,n,r,c,f);else{var p=c?c(e[l],i,l+"",e,t,f):void 0;void 0===p&&(p=i),a(e,l,p)}},l)}var o=n(346),a=n(153),i=n(377),u=n(379),s=n(23),l=n(162);e.exports=r},function(e,t,n){function r(e){var t=this.__data__=new o(e);this.size=t.size}var o=n(50),a=n(352),i=n(353),u=n(354),s=n(355),l=n(356);r.prototype.clear=a,r.prototype.delete=i,r.prototype.get=u,r.prototype.has=s,r.prototype.set=l,e.exports=r},function(e,t){function n(){this.__data__=[],this.size=0}e.exports=n},function(e,t,n){function r(e){var t=this.__data__,n=o(t,e);return!(n<0)&&(n==t.length-1?t.pop():i.call(t,n,1),--this.size,!0)}var o=n(51),a=Array.prototype,i=a.splice;e.exports=r},function(e,t,n){function r(e){var t=this.__data__,n=o(t,e);return n<0?void 0:t[n][1]}var o=n(51);e.exports=r},function(e,t,n){function r(e){return o(this.__data__,e)>-1}var o=n(51);e.exports=r},function(e,t,n){function r(e,t){var n=this.__data__,r=o(n,e);return r<0?(++this.size,n.push([e,t])):n[r][1]=t,this}var o=n(51);e.exports=r},function(e,t,n){function r(){this.__data__=new o,this.size=0}var o=n(50);e.exports=r},function(e,t){function n(e){var t=this.__data__,n=t.delete(e);return this.size=t.size,n}e.exports=n},function(e,t){function n(e){return this.__data__.get(e)}e.exports=n},function(e,t){function n(e){return this.__data__.has(e)}e.exports=n},function(e,t,n){function r(e,t){var n=this.__data__;if(n instanceof o){var r=n.__data__;if(!a||r.length<u-1)return r.push([e,t]),this.size=++n.size,this;n=this.__data__=new i(r)}return n.set(e,t),this.size=n.size,this}var o=n(50),a=n(150),i=n(364),u=200;e.exports=r},function(e,t,n){function r(e){return!(!i(e)||a(e))&&(o(e)?h:l).test(u(e))}var o=n(86),a=n(360),i=n(23),u=n(362),s=/[\\^$.*+?()[\]{}|]/g,l=/^\[object .+?Constructor\]$/,c=Function.prototype,f=Object.prototype,p=c.toString,d=f.hasOwnProperty,h=RegExp("^"+p.call(d).replace(s,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$");e.exports=r},function(e,t,n){function r(e){var t=i.call(e,s),n=e[s];try{e[s]=void 0;var r=!0}catch(e){}var o=u.call(e);return r&&(t?e[s]=n:delete e[s]),o}var o=n(151),a=Object.prototype,i=a.hasOwnProperty,u=a.toString,s=o?o.toStringTag:void 0;e.exports=r},function(e,t){function n(e){return o.call(e)}var r=Object.prototype,o=r.toString;e.exports=n},function(e,t,n){function r(e){return!!a&&a in e}var o=n(361),a=function(){var e=/[^.]+$/.exec(o&&o.keys&&o.keys.IE_PROTO||"");return e?"Symbol(src)_1."+e:""}();e.exports=r},function(e,t,n){var r=n(30),o=r["__core-js_shared__"];e.exports=o},function(e,t){function n(e){if(null!=e){try{return o.call(e)}catch(e){}try{return e+""}catch(e){}}return""}var r=Function.prototype,o=r.toString;e.exports=n},function(e,t){function n(e,t){return null==e?void 0:e[t]}e.exports=n},function(e,t,n){function r(e){var t=-1,n=null==e?0:e.length;for(this.clear();++t<n;){var r=e[t];this.set(r[0],r[1])}}var o=n(365),a=n(372),i=n(374),u=n(375),s=n(376);r.prototype.clear=o,r.prototype.delete=a,r.prototype.get=i,r.prototype.has=u,r.prototype.set=s,e.exports=r},function(e,t,n){function r(){this.size=0,this.__data__={hash:new o,map:new(i||a),string:new o}}var o=n(366),a=n(50),i=n(150);e.exports=r},function(e,t,n){function r(e){var t=-1,n=null==e?0:e.length;for(this.clear();++t<n;){var r=e[t];this.set(r[0],r[1])}}var o=n(367),a=n(368),i=n(369),u=n(370),s=n(371);r.prototype.clear=o,r.prototype.delete=a,r.prototype.get=i,r.prototype.has=u,r.prototype.set=s,e.exports=r},function(e,t,n){function r(){this.__data__=o?o(null):{},this.size=0}var o=n(54);e.exports=r},function(e,t){function n(e){var t=this.has(e)&&delete this.__data__[e];return this.size-=t?1:0,t}e.exports=n},function(e,t,n){function r(e){var t=this.__data__;if(o){var n=t[e];return n===a?void 0:n}return u.call(t,e)?t[e]:void 0}var o=n(54),a="__lodash_hash_undefined__",i=Object.prototype,u=i.hasOwnProperty;e.exports=r},function(e,t,n){function r(e){var t=this.__data__;return o?void 0!==t[e]:i.call(t,e)}var o=n(54),a=Object.prototype,i=a.hasOwnProperty;e.exports=r},function(e,t,n){function r(e,t){var n=this.__data__;return this.size+=this.has(e)?0:1,n[e]=o&&void 0===t?a:t,this}var o=n(54),a="__lodash_hash_undefined__";e.exports=r},function(e,t,n){function r(e){var t=o(this,e).delete(e);return this.size-=t?1:0,t}var o=n(55);e.exports=r},function(e,t){function n(e){var t=typeof e;return"string"==t||"number"==t||"symbol"==t||"boolean"==t?"__proto__"!==e:null===e}e.exports=n},function(e,t,n){function r(e){return o(this,e).get(e)}var o=n(55);e.exports=r},function(e,t,n){function r(e){return o(this,e).has(e)}var o=n(55);e.exports=r},function(e,t,n){function r(e,t){var n=o(this,e),r=n.size;return n.set(e,t),this.size+=n.size==r?0:1,this}var o=n(55);e.exports=r},function(e,t,n){var r=n(378),o=r();e.exports=o},function(e,t){function n(e){return function(t,n,r){for(var o=-1,a=Object(t),i=r(t),u=i.length;u--;){var s=i[e?u:++o];if(!1===n(a[s],s,a))break}return t}}e.exports=n},function(e,t,n){function r(e,t,n,r,g,b,_){var w=e[n],E=t[n],O=_.get(E);if(O)return void o(e,n,O);var P=b?b(w,E,n+"",e,t,_):void 0,C=void 0===P;if(C){var x=c(E),k=!x&&p(E),S=!x&&!k&&v(E);P=E,x||k||S?c(w)?P=w:f(w)?P=u(w):k?(C=!1,P=a(E,!0)):S?(C=!1,P=i(E,!0)):P=[]:y(E)||l(E)?(P=w,l(w)?P=m(w):(!h(w)||r&&d(w))&&(P=s(E))):C=!1}C&&(_.set(E,P),g(P,E,r,b,_),_.delete(E)),o(e,n,P)}var o=n(153),a=n(380),i=n(381),u=n(384),s=n(385),l=n(157),c=n(158),f=n(389),p=n(160),d=n(86),h=n(23),y=n(391),v=n(161),m=n(395);e.exports=r},function(e,t,n){(function(e){function r(e,t){if(t)return e.slice();var n=e.length,r=l?l(n):new e.constructor(n);return e.copy(r),r}var o=n(30),a="object"==typeof t&&t&&!t.nodeType&&t,i=a&&"object"==typeof e&&e&&!e.nodeType&&e,u=i&&i.exports===a,s=u?o.Buffer:void 0,l=s?s.allocUnsafe:void 0;e.exports=r}).call(t,n(37)(e))},function(e,t,n){function r(e,t){var n=t?o(e.buffer):e.buffer;return new e.constructor(n,e.byteOffset,e.length)}var o=n(382);e.exports=r},function(e,t,n){function r(e){var t=new e.constructor(e.byteLength);return new o(t).set(new o(e)),t}var o=n(383);e.exports=r},function(e,t,n){var r=n(30),o=r.Uint8Array;e.exports=o},function(e,t){function n(e,t){var n=-1,r=e.length;for(t||(t=Array(r));++n<r;)t[n]=e[n];return t}e.exports=n},function(e,t,n){function r(e){return"function"!=typeof e.constructor||i(e)?{}:o(a(e))}var o=n(386),a=n(155),i=n(156);e.exports=r},function(e,t,n){var r=n(23),o=Object.create,a=function(){function e(){}return function(t){if(!r(t))return{};if(o)return o(t);e.prototype=t;var n=new e;return e.prototype=void 0,n}}();e.exports=a},function(e,t){function n(e,t){return function(n){return e(t(n))}}e.exports=n},function(e,t,n){function r(e){return a(e)&&o(e)==i}var o=n(53),a=n(40),i="[object Arguments]";e.exports=r},function(e,t,n){function r(e){return a(e)&&o(e)}var o=n(88),a=n(40);e.exports=r},function(e,t){function n(){return!1}e.exports=n},function(e,t,n){function r(e){if(!i(e)||o(e)!=u)return!1;var t=a(e);if(null===t)return!0;var n=f.call(t,"constructor")&&t.constructor;return"function"==typeof n&&n instanceof n&&c.call(n)==p}var o=n(53),a=n(155),i=n(40),u="[object Object]",s=Function.prototype,l=Object.prototype,c=s.toString,f=l.hasOwnProperty,p=c.call(Object);e.exports=r},function(e,t,n){function r(e){return i(e)&&a(e.length)&&!!u[o(e)]}var o=n(53),a=n(159),i=n(40),u={};u["[object Float32Array]"]=u["[object Float64Array]"]=u["[object Int8Array]"]=u["[object Int16Array]"]=u["[object Int32Array]"]=u["[object Uint8Array]"]=u["[object Uint8ClampedArray]"]=u["[object Uint16Array]"]=u["[object Uint32Array]"]=!0,u["[object Arguments]"]=u["[object Array]"]=u["[object ArrayBuffer]"]=u["[object Boolean]"]=u["[object DataView]"]=u["[object Date]"]=u["[object Error]"]=u["[object Function]"]=u["[object Map]"]=u["[object Number]"]=u["[object Object]"]=u["[object RegExp]"]=u["[object Set]"]=u["[object String]"]=u["[object WeakMap]"]=!1,e.exports=r},function(e,t){function n(e){return function(t){return e(t)}}e.exports=n},function(e,t,n){(function(e){var r=n(152),o="object"==typeof t&&t&&!t.nodeType&&t,a=o&&"object"==typeof e&&e&&!e.nodeType&&e,i=a&&a.exports===o,u=i&&r.process,s=function(){try{return u&&u.binding&&u.binding("util")}catch(e){}}();e.exports=s}).call(t,n(37)(e))},function(e,t,n){function r(e){return o(e,a(e))}var o=n(396),a=n(162);e.exports=r},function(e,t,n){function r(e,t,n,r){var i=!n;n||(n={});for(var u=-1,s=t.length;++u<s;){var l=t[u],c=r?r(n[l],e[l],l,n,e):void 0;void 0===c&&(c=e[l]),i?a(n,l,c):o(n,l,c)}return n}var o=n(397),a=n(87);e.exports=r},function(e,t,n){function r(e,t,n){var r=e[t];u.call(e,t)&&a(r,n)&&(void 0!==n||t in e)||o(e,t,n)}var o=n(87),a=n(52),i=Object.prototype,u=i.hasOwnProperty;e.exports=r},function(e,t,n){function r(e,t){var n=i(e),r=!n&&a(e),c=!n&&!r&&u(e),p=!n&&!r&&!c&&l(e),d=n||r||c||p,h=d?o(e.length,String):[],y=h.length;for(var v in e)!t&&!f.call(e,v)||d&&("length"==v||c&&("offset"==v||"parent"==v)||p&&("buffer"==v||"byteLength"==v||"byteOffset"==v)||s(v,y))||h.push(v);return h}var o=n(399),a=n(157),i=n(158),u=n(160),s=n(163),l=n(161),c=Object.prototype,f=c.hasOwnProperty;e.exports=r},function(e,t){function n(e,t){for(var n=-1,r=Array(e);++n<e;)r[n]=t(n);return r}e.exports=n},function(e,t,n){function r(e){if(!o(e))return i(e);var t=a(e),n=[];for(var r in e)("constructor"!=r||!t&&s.call(e,r))&&n.push(r);return n}var o=n(23),a=n(156),i=n(401),u=Object.prototype,s=u.hasOwnProperty;e.exports=r},function(e,t){function n(e){var t=[];if(null!=e)for(var n in Object(e))t.push(n);return t}e.exports=n},function(e,t,n){function r(e){return o(function(t,n){var r=-1,o=n.length,i=o>1?n[o-1]:void 0,u=o>2?n[2]:void 0;for(i=e.length>3&&"function"==typeof i?(o--,i):void 0,u&&a(n[0],n[1],u)&&(i=o<3?void 0:i,o=1),t=Object(t);++r<o;){var s=n[r];s&&e(t,s,r,i)}return t})}var o=n(403),a=n(410);e.exports=r},function(e,t,n){function r(e,t){return i(a(e,t,o),e+"")}var o=n(164),a=n(404),i=n(406);e.exports=r},function(e,t,n){function r(e,t,n){return t=a(void 0===t?e.length-1:t,0),function(){for(var r=arguments,i=-1,u=a(r.length-t,0),s=Array(u);++i<u;)s[i]=r[t+i];i=-1;for(var l=Array(t+1);++i<t;)l[i]=r[i];return l[t]=n(s),o(e,this,l)}}var o=n(405),a=Math.max;e.exports=r},function(e,t){function n(e,t,n){switch(n.length){case 0:return e.call(t);case 1:return e.call(t,n[0]);case 2:return e.call(t,n[0],n[1]);case 3:return e.call(t,n[0],n[1],n[2])}return e.apply(t,n)}e.exports=n},function(e,t,n){var r=n(407),o=n(409),a=o(r);e.exports=a},function(e,t,n){var r=n(408),o=n(154),a=n(164),i=o?function(e,t){return o(e,"toString",{configurable:!0,enumerable:!1,value:r(t),writable:!0})}:a;e.exports=i},function(e,t){function n(e){return function(){return e}}e.exports=n},function(e,t){function n(e){var t=0,n=0;return function(){var i=a(),u=o-(i-n);if(n=i,u>0){if(++t>=r)return arguments[0]}else t=0;return e.apply(void 0,arguments)}}var r=800,o=16,a=Date.now;e.exports=n},function(e,t,n){function r(e,t,n){if(!u(n))return!1;var r=typeof t;return!!("number"==r?a(n)&&i(t,n.length):"string"==r&&t in n)&&o(n[t],e)}var o=n(52),a=n(88),i=n(163),u=n(23);e.exports=r},function(e,t,n){"use strict";function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var u=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),s=n(0),l=function(e){return e&&e.__esModule?e:{default:e}}(s),c=function(e){function t(e){o(this,t);var n=a(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));n.props.playlist;return n.state=n.props.playlist,n.handleDeletePlaylist=n.handleDeletePlaylist.bind(n),n}return i(t,e),u(t,[{key:"handleChange",value:function(e){var t=this;return function(n){t.setState(r({},e,n.target.value))}}},{key:"handleDeletePlaylist",value:function(){var e=this;this.props.deletePlaylist(this.state.id).then(function(){return e.props.history.push("/")})}},{key:"render",value:function(){var e=this.state.name;return l.default.createElement("div",{className:"vbox delete-playlist-flex-container"},l.default.createElement("div",{className:"new-playlist-title"},l.default.createElement("h1",null,"Delete '",e,"' playlist?")),l.default.createElement("div",{name:"new-playlist-actions"},l.default.createElement("button",{className:"btn-sm btn-xl-create-pl btn-green",onClick:this.handleDeletePlaylist},"Delete")))}}]),t}(l.default.Component);t.default=c},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var u=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),s=n(0),l=r(s),c=n(413),f=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}(c),p=n(414),d=r(p),h=n(423),y=r(h),v=function(e){function t(e){o(this,t);var n=a(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.state={query:"",results:{songs:{},users:{}}},n.handleSearch=n.handleSearch.bind(n),n.handleSearchInputChange=n.handleSearchInputChange.bind(n),n}return i(t,e),u(t,[{key:"componenWillReceiveProps",value:function(){document.getElementById("search-input").focus()}},{key:"componentDidMount",value:function(){document.getElementById("search-input").focus(),document.getElementById("search-input").addEventListener("keyup",y.default.debounce(this.handleSearch,500))}},{key:"handleSearch",value:function(){var e=this;this.state.query&&f.searchFor(this.state.query).then(function(t){var n={},r={};t.song_results&&(n=t.song_results),t.user_results&&t.user_results.user_details&&(r=t.user_results.user_details),e.setState({results:{songs:n,users:r}})})}},{key:"handleSearchInputChange",value:function(e){e.preventDefault(),e.target.value?this.setState({query:e.target.value}):this.setState({query:"",results:{songs:{},users:{}}})}},{key:"render",value:function(){var e=this.state.results,t=e.users,n=e.songs;return l.default.createElement("div",{className:"vbox search-root-flex-container"},l.default.createElement("div",{className:"vbox search-input-flex-container"},l.default.createElement("div",{className:"hbox input-label-container"},"Search for song or user"),l.default.createElement("div",{className:"hbox input-field-container"},l.default.createElement("input",{id:"search-input",onChange:this.handleSearchInputChange,className:"modal-input-dark",placeholder:"Start typing...",value:this.state.query}))),l.default.createElement("div",{className:"vbox results-flex-container"},l.default.createElement("div",{className:"hbox reults-categories-flex-container"},l.default.createElement(d.default,{users:Object.values(t),songs:Object.values(n)}))))}}]),t}(l.default.Component);t.default=v},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.searchFor=function(e){return $.ajax({method:"GET",url:"api/searches/",data:{search_tag:e}})}},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var o=n(0),a=r(o),i=n(415),u=n(148),s=r(u),l=n(421),c=r(l),f=n(422),p=r(f),d=n(49),h=function(e){var t={name:"Search"},n=a.default.createElement(p.default,{property:"song"}),r=a.default.createElement(p.default,{property:"user"});return e.songs.length&&(n=a.default.createElement(s.default,{collectionType:d.SEARCH_COLLECTION,songs:e.songs,showDelete:!1,collection:t})),e.users.length&&(r=e.users.map(function(e){return a.default.createElement(c.default,{key:"user-id-"+e.id,user:e})})),a.default.createElement(i.Tabs,{className:"vbox tab-flex-container"},a.default.createElement(i.TabList,{className:"hbox tab-title-flex-container"},a.default.createElement(i.Tab,{className:"vbox tab-title-item"},"Songs"),a.default.createElement(i.Tab,{className:"vbox tab-title-item"},"Users")),a.default.createElement("div",{className:"result-tab-panel-flex"},a.default.createElement(i.TabPanel,{className:"songs-result-tab"},n),a.default.createElement(i.TabPanel,{className:"hbox users-result-tab"},r)))};t.default=h},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0,t.resetIdCounter=t.Tabs=t.TabPanel=t.TabList=t.Tab=void 0;var o=n(416),a=r(o),i=n(418),u=r(i),s=n(419),l=r(s),c=n(420),f=r(c),p=n(166);t.Tab=l.default,t.TabList=u.default,t.TabPanel=f.default,t.Tabs=a.default,t.resetIdCounter=p.reset},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){var n={};for(var r in e)t.indexOf(r)>=0||Object.prototype.hasOwnProperty.call(e,r)&&(n[r]=e[r]);return n}function a(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function u(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}t.__esModule=!0;var s=n(5),l=(r(s),n(0)),c=r(l),f=(n(165),n(417)),p=r(f),d=n(167),h=function(e){function t(n){a(this,t);var r=i(this,e.call(this,n));return r.handleSelected=function(e,n,o){if("function"!=typeof r.props.onSelect||!1!==r.props.onSelect(e,n,o)){var a={focus:"keydown"===o.type};t.inUncontrolledMode(r.props)&&(a.selectedIndex=e),r.setState(a)}},r.state=t.copyPropsToState(r.props,{},r.props.defaultFocus),r}return u(t,e),t.prototype.componentWillReceiveProps=function(e){this.setState(function(n){return t.copyPropsToState(e,n)})},t.inUncontrolledMode=function(e){return null===e.selectedIndex},t.copyPropsToState=function(e,n){var r=arguments.length>2&&void 0!==arguments[2]&&arguments[2],o={focus:r};if(t.inUncontrolledMode(e)){var a=(0,d.getTabsCount)(e.children)-1,i=null;i=null!=n.selectedIndex?Math.min(n.selectedIndex,a):e.defaultIndex||0,o.selectedIndex=i}return o},t.prototype.render=function(){var e=this.props,t=e.children,n=(e.defaultIndex,e.defaultFocus,o(e,["children","defaultIndex","defaultFocus"]));return n.focus=this.state.focus,n.onSelect=this.handleSelected,null!=this.state.selectedIndex&&(n.selectedIndex=this.state.selectedIndex),c.default.createElement(p.default,n,t)},t}(l.Component);h.defaultProps={defaultFocus:!1,forceRenderTabPanel:!1,selectedIndex:null,defaultIndex:null},t.default=h,h.propTypes={},h.tabsRole="Tabs"},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){var n={};for(var r in e)t.indexOf(r)>=0||Object.prototype.hasOwnProperty.call(e,r)&&(n[r]=e[r]);return n}function a(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function u(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function s(e){return"LI"===e.nodeName&&"tab"===e.getAttribute("role")}function l(e){return"true"===e.getAttribute("aria-disabled")}t.__esModule=!0;var c=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},f=n(5),p=(r(f),n(0)),d=r(p),h=n(57),y=r(h),v=n(166),m=r(v),g=(n(165),n(167)),b=n(89),_=n(56),w=void 0;try{w=!("undefined"==typeof window||!window.document||!window.document.activeElement)}catch(e){w=!1}var E=function(e){function t(){var n,r,o;a(this,t);for(var u=arguments.length,c=Array(u),f=0;f<u;f++)c[f]=arguments[f];return n=r=i(this,e.call.apply(e,[this].concat(c))),r.tabNodes=[],r.handleKeyDown=function(e){if(r.isTabFromContainer(e.target)){var t=r.props.selectedIndex,n=!1;37===e.keyCode||38===e.keyCode?(t=r.getPrevTab(t),n=!0):39!==e.keyCode&&40!==e.keyCode||(t=r.getNextTab(t),n=!0),n&&e.preventDefault(),r.setSelected(t,e)}},r.handleClick=function(e){var t=e.target;do{if(r.isTabFromContainer(t)){if(l(t))return;var n=[].slice.call(t.parentNode.children).filter(s).indexOf(t);return void r.setSelected(n,e)}}while(null!==(t=t.parentNode))},o=n,i(r,o)}return u(t,e),t.prototype.setSelected=function(e,t){e<0||e>=this.getTabsCount()||this.props.onSelect(e,this.props.selectedIndex,t)},t.prototype.getNextTab=function(e){for(var t=this.getTabsCount(),n=e+1;n<t;n++)if(!l(this.getTab(n)))return n;for(var r=0;r<e;r++)if(!l(this.getTab(r)))return r;return e},t.prototype.getPrevTab=function(e){for(var t=e;t--;)if(!l(this.getTab(t)))return t;for(t=this.getTabsCount();t-- >e;)if(!l(this.getTab(t)))return t;return e},t.prototype.getTabsCount=function(){return(0,g.getTabsCount)(this.props.children)},t.prototype.getPanelsCount=function(){return(0,g.getPanelsCount)(this.props.children)},t.prototype.getTab=function(e){return this.tabNodes["tabs-"+e]},t.prototype.getChildren=function(){var e=this,t=0,n=this.props,r=n.children,o=n.disabledTabClassName,a=n.focus,i=n.forceRenderTabPanel,u=n.selectedIndex,s=n.selectedTabClassName,l=n.selectedTabPanelClassName;this.tabIds=this.tabIds||[],this.panelIds=this.panelIds||[];for(var c=this.tabIds.length-this.getTabsCount();c++<0;)this.tabIds.push((0,m.default)()),this.panelIds.push((0,m.default)());return(0,b.deepMap)(r,function(n){var r=n;if((0,_.isTabList)(n)){var c=0,f=!1;w&&(f=d.default.Children.toArray(n.props.children).filter(_.isTab).some(function(t,n){return document.activeElement===e.getTab(n)})),r=(0,p.cloneElement)(n,{children:(0,b.deepMap)(n.props.children,function(t){var n="tabs-"+c,r=u===c,i={tabRef:function(t){e.tabNodes[n]=t},id:e.tabIds[c],panelId:e.panelIds[c],selected:r,focus:r&&(a||f)};return s&&(i.selectedClassName=s),o&&(i.disabledClassName=o),c++,(0,p.cloneElement)(t,i)})})}else if((0,_.isTabPanel)(n)){var h={id:e.panelIds[t],tabId:e.tabIds[t],selected:u===t};i&&(h.forceRender=i),l&&(h.selectedClassName=l),t++,r=(0,p.cloneElement)(n,h)}return r})},t.prototype.isTabFromContainer=function(e){if(!s(e))return!1;var t=e.parentElement;do{if(t===this.node)return!0;if(t.getAttribute("data-tabs"))break;t=t.parentElement}while(t);return!1},t.prototype.render=function(){var e=this,t=this.props,n=(t.children,t.className),r=(t.disabledTabClassName,t.focus,t.forceRenderTabPanel,t.onSelect,t.selectedIndex,t.selectedTabClassName,t.selectedTabPanelClassName,o(t,["children","className","disabledTabClassName","focus","forceRenderTabPanel","onSelect","selectedIndex","selectedTabClassName","selectedTabPanelClassName"]));return d.default.createElement("div",c({},r,{className:(0,y.default)(n),onClick:this.handleClick,onKeyDown:this.handleKeyDown,ref:function(t){e.node=t},"data-tabs":!0}),this.getChildren())},t}(p.Component);E.defaultProps={className:"react-tabs",focus:!1},t.default=E,E.propTypes={}},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){var n={};for(var r in e)t.indexOf(r)>=0||Object.prototype.hasOwnProperty.call(e,r)&&(n[r]=e[r]);return n}function a(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function u(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}t.__esModule=!0;var s=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},l=n(5),c=(r(l),n(0)),f=r(c),p=n(57),d=r(p),h=function(e){function t(){return a(this,t),i(this,e.apply(this,arguments))}return u(t,e),t.prototype.render=function(){var e=this.props,t=e.children,n=e.className,r=o(e,["children","className"]);return f.default.createElement("ul",s({},r,{className:(0,d.default)(n),role:"tablist"}),t)},t}(c.Component);h.defaultProps={className:"react-tabs__tab-list"},t.default=h,h.propTypes={},h.tabsRole="TabList"},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){var n={};for(var r in e)t.indexOf(r)>=0||Object.prototype.hasOwnProperty.call(e,r)&&(n[r]=e[r]);return n}function a(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function u(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}t.__esModule=!0;var s=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},l=n(5),c=(r(l),n(0)),f=r(c),p=n(57),d=r(p),h=function(e){function t(){return a(this,t),i(this,e.apply(this,arguments))}return u(t,e),t.prototype.componentDidMount=function(){this.checkFocus()},t.prototype.componentDidUpdate=function(){this.checkFocus()},t.prototype.checkFocus=function(){this.props.selected&&this.props.focus&&this.node.focus()},t.prototype.render=function(){var e,t=this,n=this.props,r=n.children,a=n.className,i=n.disabled,u=n.disabledClassName,l=(n.focus,n.id),c=n.panelId,p=n.selected,h=n.selectedClassName,y=n.tabRef,v=o(n,["children","className","disabled","disabledClassName","focus","id","panelId","selected","selectedClassName","tabRef"]);return f.default.createElement("li",s({},v,{className:(0,d.default)(a,(e={},e[h]=p,e[u]=i,e)),ref:function(e){t.node=e,y&&y(e)},role:"tab",id:l,"aria-selected":p?"true":"false","aria-disabled":i?"true":"false","aria-controls":c,tabIndex:p?"0":null}),r)},t}(c.Component);h.defaultProps={className:"react-tabs__tab",disabledClassName:"react-tabs__tab--disabled",focus:!1,id:null,panelId:null,selected:!1,selectedClassName:"react-tabs__tab--selected"},t.default=h,h.propTypes={},h.tabsRole="Tab"},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){var n={};for(var r in e)t.indexOf(r)>=0||Object.prototype.hasOwnProperty.call(e,r)&&(n[r]=e[r]);return n}function a(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function u(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}t.__esModule=!0;var s=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},l=n(5),c=(r(l),n(0)),f=r(c),p=n(57),d=r(p),h=function(e){function t(){return a(this,t),i(this,e.apply(this,arguments))}return u(t,e),t.prototype.render=function(){var e,t=this.props,n=t.children,r=t.className,a=t.forceRender,i=t.id,u=t.selected,l=t.selectedClassName,c=t.tabId,p=o(t,["children","className","forceRender","id","selected","selectedClassName","tabId"]);return f.default.createElement("div",s({},p,{className:(0,d.default)(r,(e={},e[l]=u,e)),role:"tabpanel",id:i,"aria-labelledby":c}),a||u?n:null)},t}(c.Component);h.defaultProps={className:"react-tabs__tab-panel",forceRender:!1,selectedClassName:"react-tabs__tab-panel--selected",style:{}},t.default=h,h.propTypes={},h.tabsRole="TabPanel"},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),u=n(0),s=function(e){return e&&e.__esModule?e:{default:e}}(u),l=n(8),c=function(e){function t(e){return r(this,t),o(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))}return a(t,e),i(t,[{key:"render",value:function(){var e=this.props.user;return s.default.createElement("div",{className:"hbox mini-user-display"},s.default.createElement("div",{className:"vbox user-mini-image"},s.default.createElement(l.Link,{to:"/user/"+e.id},s.default.createElement("img",{src:e.image_url}))),s.default.createElement("div",{className:"vbox user-mini-details"},s.default.createElement("div",{className:"user-mini-username"},e.username),s.default.createElement("div",{className:"user-mini-pl-details"},"Number of playlists: ",e.playlists_ids.length)))}}]),t}(s.default.Component);t.default=c},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(0),o=function(e){return e&&e.__esModule?e:{default:e}}(r),a=function(e){return o.default.createElement("div",{className:"hbox no-result-flex-container"},o.default.createElement("div",{className:"vbox no-result-content-container"},o.default.createElement("h1",null,"No ",e.property," results..."),o.default.createElement("i",{className:"fa fa-meh-o fa-5x no-result-sad-smiley"})))};t.default=a},function(e,t,n){(function(e,r){var o;(function(){function a(e,t){return e.set(t[0],t[1]),e}function i(e,t){return e.add(t),e}function u(e,t,n){switch(n.length){case 0:return e.call(t);case 1:return e.call(t,n[0]);case 2:return e.call(t,n[0],n[1]);case 3:return e.call(t,n[0],n[1],n[2])}return e.apply(t,n)}function s(e,t,n,r){for(var o=-1,a=null==e?0:e.length;++o<a;){var i=e[o];t(r,i,n(i),e)}return r}function l(e,t){for(var n=-1,r=null==e?0:e.length;++n<r&&!1!==t(e[n],n,e););return e}function c(e,t){for(var n=null==e?0:e.length;n--&&!1!==t(e[n],n,e););return e}function f(e,t){for(var n=-1,r=null==e?0:e.length;++n<r;)if(!t(e[n],n,e))return!1;return!0}function p(e,t){for(var n=-1,r=null==e?0:e.length,o=0,a=[];++n<r;){var i=e[n];t(i,n,e)&&(a[o++]=i)}return a}function d(e,t){return!!(null==e?0:e.length)&&P(e,t,0)>-1}function h(e,t,n){for(var r=-1,o=null==e?0:e.length;++r<o;)if(n(t,e[r]))return!0;return!1}function y(e,t){for(var n=-1,r=null==e?0:e.length,o=Array(r);++n<r;)o[n]=t(e[n],n,e);return o}function v(e,t){for(var n=-1,r=t.length,o=e.length;++n<r;)e[o+n]=t[n];return e}function m(e,t,n,r){var o=-1,a=null==e?0:e.length;for(r&&a&&(n=e[++o]);++o<a;)n=t(n,e[o],o,e);return n}function g(e,t,n,r){var o=null==e?0:e.length;for(r&&o&&(n=e[--o]);o--;)n=t(n,e[o],o,e);return n}function b(e,t){for(var n=-1,r=null==e?0:e.length;++n<r;)if(t(e[n],n,e))return!0;return!1}function _(e){return e.split("")}function w(e){return e.match(Vt)||[]}function E(e,t,n){var r;return n(e,function(e,n,o){if(t(e,n,o))return r=n,!1}),r}function O(e,t,n,r){for(var o=e.length,a=n+(r?1:-1);r?a--:++a<o;)if(t(e[a],a,e))return a;return-1}function P(e,t,n){return t===t?Q(e,t,n):O(e,x,n)}function C(e,t,n,r){for(var o=n-1,a=e.length;++o<a;)if(r(e[o],t))return o;return-1}function x(e){return e!==e}function k(e,t){var n=null==e?0:e.length;return n?N(e,t)/n:Ae}function S(e){return function(t){return null==t?oe:t[e]}}function T(e){return function(t){return null==e?oe:e[t]}}function j(e,t,n,r,o){return o(e,function(e,o,a){n=r?(r=!1,e):t(n,e,o,a)}),n}function R(e,t){var n=e.length;for(e.sort(t);n--;)e[n]=e[n].value;return e}function N(e,t){for(var n,r=-1,o=e.length;++r<o;){var a=t(e[r]);a!==oe&&(n=n===oe?a:n+a)}return n}function M(e,t){for(var n=-1,r=Array(e);++n<e;)r[n]=t(n);return r}function I(e,t){return y(t,function(t){return[t,e[t]]})}function A(e){return function(t){return e(t)}}function D(e,t){return y(t,function(t){return e[t]})}function L(e,t){return e.has(t)}function U(e,t){for(var n=-1,r=e.length;++n<r&&P(t,e[n],0)>-1;);return n}function F(e,t){for(var n=e.length;n--&&P(t,e[n],0)>-1;);return n}function V(e,t){for(var n=e.length,r=0;n--;)e[n]===t&&++r;return r}function W(e){return"\\"+Sn[e]}function B(e,t){return null==e?oe:e[t]}function q(e){return bn.test(e)}function H(e){return _n.test(e)}function z(e){for(var t,n=[];!(t=e.next()).done;)n.push(t.value);return n}function Y(e){var t=-1,n=Array(e.size);return e.forEach(function(e,r){n[++t]=[r,e]}),n}function K(e,t){return function(n){return e(t(n))}}function $(e,t){for(var n=-1,r=e.length,o=0,a=[];++n<r;){var i=e[n];i!==t&&i!==ce||(e[n]=ce,a[o++]=n)}return a}function G(e){var t=-1,n=Array(e.size);return e.forEach(function(e){n[++t]=e}),n}function X(e){var t=-1,n=Array(e.size);return e.forEach(function(e){n[++t]=[e,e]}),n}function Q(e,t,n){for(var r=n-1,o=e.length;++r<o;)if(e[r]===t)return r;return-1}function J(e,t,n){for(var r=n+1;r--;)if(e[r]===t)return r;return r}function Z(e){return q(e)?te(e):zn(e)}function ee(e){return q(e)?ne(e):_(e)}function te(e){for(var t=mn.lastIndex=0;mn.test(e);)++t;return t}function ne(e){return e.match(mn)||[]}function re(e){return e.match(gn)||[]}var oe,ae=200,ie="Unsupported core-js use. Try https://npms.io/search?q=ponyfill.",ue="Expected a function",se="__lodash_hash_undefined__",le=500,ce="__lodash_placeholder__",fe=1,pe=2,de=4,he=1,ye=2,ve=1,me=2,ge=4,be=8,_e=16,we=32,Ee=64,Oe=128,Pe=256,Ce=512,xe=30,ke="...",Se=800,Te=16,je=1,Re=2,Ne=1/0,Me=9007199254740991,Ie=1.7976931348623157e308,Ae=NaN,De=4294967295,Le=De-1,Ue=De>>>1,Fe=[["ary",Oe],["bind",ve],["bindKey",me],["curry",be],["curryRight",_e],["flip",Ce],["partial",we],["partialRight",Ee],["rearg",Pe]],Ve="[object Arguments]",We="[object Array]",Be="[object AsyncFunction]",qe="[object Boolean]",He="[object Date]",ze="[object DOMException]",Ye="[object Error]",Ke="[object Function]",$e="[object GeneratorFunction]",Ge="[object Map]",Xe="[object Number]",Qe="[object Null]",Je="[object Object]",Ze="[object Proxy]",et="[object RegExp]",tt="[object Set]",nt="[object String]",rt="[object Symbol]",ot="[object Undefined]",at="[object WeakMap]",it="[object WeakSet]",ut="[object ArrayBuffer]",st="[object DataView]",lt="[object Float32Array]",ct="[object Float64Array]",ft="[object Int8Array]",pt="[object Int16Array]",dt="[object Int32Array]",ht="[object Uint8Array]",yt="[object Uint8ClampedArray]",vt="[object Uint16Array]",mt="[object Uint32Array]",gt=/\b__p \+= '';/g,bt=/\b(__p \+=) '' \+/g,_t=/(__e\(.*?\)|\b__t\)) \+\n'';/g,wt=/&(?:amp|lt|gt|quot|#39);/g,Et=/[&<>"']/g,Ot=RegExp(wt.source),Pt=RegExp(Et.source),Ct=/<%-([\s\S]+?)%>/g,xt=/<%([\s\S]+?)%>/g,kt=/<%=([\s\S]+?)%>/g,St=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,Tt=/^\w*$/,jt=/^\./,Rt=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,Nt=/[\\^$.*+?()[\]{}|]/g,Mt=RegExp(Nt.source),It=/^\s+|\s+$/g,At=/^\s+/,Dt=/\s+$/,Lt=/\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/,Ut=/\{\n\/\* \[wrapped with (.+)\] \*/,Ft=/,? & /,Vt=/[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g,Wt=/\\(\\)?/g,Bt=/\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g,qt=/\w*$/,Ht=/^[-+]0x[0-9a-f]+$/i,zt=/^0b[01]+$/i,Yt=/^\[object .+?Constructor\]$/,Kt=/^0o[0-7]+$/i,$t=/^(?:0|[1-9]\d*)$/,Gt=/[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g,Xt=/($^)/,Qt=/['\n\r\u2028\u2029\\]/g,Jt="\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff",Zt="\\xac\\xb1\\xd7\\xf7\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf\\u2000-\\u206f \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000",en="["+Zt+"]",tn="["+Jt+"]",nn="[a-z\\xdf-\\xf6\\xf8-\\xff]",rn="[^\\ud800-\\udfff"+Zt+"\\d+\\u2700-\\u27bfa-z\\xdf-\\xf6\\xf8-\\xffA-Z\\xc0-\\xd6\\xd8-\\xde]",on="\\ud83c[\\udffb-\\udfff]",an="(?:\\ud83c[\\udde6-\\uddff]){2}",un="[\\ud800-\\udbff][\\udc00-\\udfff]",sn="[A-Z\\xc0-\\xd6\\xd8-\\xde]",ln="(?:"+nn+"|"+rn+")",cn="(?:[\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff]|\\ud83c[\\udffb-\\udfff])?",fn="(?:\\u200d(?:"+["[^\\ud800-\\udfff]",an,un].join("|")+")[\\ufe0e\\ufe0f]?"+cn+")*",pn="[\\ufe0e\\ufe0f]?"+cn+fn,dn="(?:"+["[\\u2700-\\u27bf]",an,un].join("|")+")"+pn,hn="(?:"+["[^\\ud800-\\udfff]"+tn+"?",tn,an,un,"[\\ud800-\\udfff]"].join("|")+")",yn=RegExp("['’]","g"),vn=RegExp(tn,"g"),mn=RegExp(on+"(?="+on+")|"+hn+pn,"g"),gn=RegExp([sn+"?"+nn+"+(?:['’](?:d|ll|m|re|s|t|ve))?(?="+[en,sn,"$"].join("|")+")","(?:[A-Z\\xc0-\\xd6\\xd8-\\xde]|[^\\ud800-\\udfff\\xac\\xb1\\xd7\\xf7\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf\\u2000-\\u206f \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000\\d+\\u2700-\\u27bfa-z\\xdf-\\xf6\\xf8-\\xffA-Z\\xc0-\\xd6\\xd8-\\xde])+(?:['’](?:D|LL|M|RE|S|T|VE))?(?="+[en,sn+ln,"$"].join("|")+")",sn+"?"+ln+"+(?:['’](?:d|ll|m|re|s|t|ve))?",sn+"+(?:['’](?:D|LL|M|RE|S|T|VE))?","\\d*(?:(?:1ST|2ND|3RD|(?![123])\\dTH)\\b)","\\d*(?:(?:1st|2nd|3rd|(?![123])\\dth)\\b)","\\d+",dn].join("|"),"g"),bn=RegExp("[\\u200d\\ud800-\\udfff"+Jt+"\\ufe0e\\ufe0f]"),_n=/[a-z][A-Z]|[A-Z]{2,}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/,wn=["Array","Buffer","DataView","Date","Error","Float32Array","Float64Array","Function","Int8Array","Int16Array","Int32Array","Map","Math","Object","Promise","RegExp","Set","String","Symbol","TypeError","Uint8Array","Uint8ClampedArray","Uint16Array","Uint32Array","WeakMap","_","clearTimeout","isFinite","parseInt","setTimeout"],En=-1,On={};On[lt]=On[ct]=On[ft]=On[pt]=On[dt]=On[ht]=On[yt]=On[vt]=On[mt]=!0,On[Ve]=On[We]=On[ut]=On[qe]=On[st]=On[He]=On[Ye]=On[Ke]=On[Ge]=On[Xe]=On[Je]=On[et]=On[tt]=On[nt]=On[at]=!1;var Pn={};Pn[Ve]=Pn[We]=Pn[ut]=Pn[st]=Pn[qe]=Pn[He]=Pn[lt]=Pn[ct]=Pn[ft]=Pn[pt]=Pn[dt]=Pn[Ge]=Pn[Xe]=Pn[Je]=Pn[et]=Pn[tt]=Pn[nt]=Pn[rt]=Pn[ht]=Pn[yt]=Pn[vt]=Pn[mt]=!0,Pn[Ye]=Pn[Ke]=Pn[at]=!1;var Cn={"À":"A","Á":"A","Â":"A","Ã":"A","Ä":"A","Å":"A","à":"a","á":"a","â":"a","ã":"a","ä":"a","å":"a","Ç":"C","ç":"c","Ð":"D","ð":"d","È":"E","É":"E","Ê":"E","Ë":"E","è":"e","é":"e","ê":"e","ë":"e","Ì":"I","Í":"I","Î":"I","Ï":"I","ì":"i","í":"i","î":"i","ï":"i","Ñ":"N","ñ":"n","Ò":"O","Ó":"O","Ô":"O","Õ":"O","Ö":"O","Ø":"O","ò":"o","ó":"o","ô":"o","õ":"o","ö":"o","ø":"o","Ù":"U","Ú":"U","Û":"U","Ü":"U","ù":"u","ú":"u","û":"u","ü":"u","Ý":"Y","ý":"y","ÿ":"y","Æ":"Ae","æ":"ae","Þ":"Th","þ":"th","ß":"ss","Ā":"A","Ă":"A","Ą":"A","ā":"a","ă":"a","ą":"a","Ć":"C","Ĉ":"C","Ċ":"C","Č":"C","ć":"c","ĉ":"c","ċ":"c","č":"c","Ď":"D","Đ":"D","ď":"d","đ":"d","Ē":"E","Ĕ":"E","Ė":"E","Ę":"E","Ě":"E","ē":"e","ĕ":"e","ė":"e","ę":"e","ě":"e","Ĝ":"G","Ğ":"G","Ġ":"G","Ģ":"G","ĝ":"g","ğ":"g","ġ":"g","ģ":"g","Ĥ":"H","Ħ":"H","ĥ":"h","ħ":"h","Ĩ":"I","Ī":"I","Ĭ":"I","Į":"I","İ":"I","ĩ":"i","ī":"i","ĭ":"i","į":"i","ı":"i","Ĵ":"J","ĵ":"j","Ķ":"K","ķ":"k","ĸ":"k","Ĺ":"L","Ļ":"L","Ľ":"L","Ŀ":"L","Ł":"L","ĺ":"l","ļ":"l","ľ":"l","ŀ":"l","ł":"l","Ń":"N","Ņ":"N","Ň":"N","Ŋ":"N","ń":"n","ņ":"n","ň":"n","ŋ":"n","Ō":"O","Ŏ":"O","Ő":"O","ō":"o","ŏ":"o","ő":"o","Ŕ":"R","Ŗ":"R","Ř":"R","ŕ":"r","ŗ":"r","ř":"r","Ś":"S","Ŝ":"S","Ş":"S","Š":"S","ś":"s","ŝ":"s","ş":"s","š":"s","Ţ":"T","Ť":"T","Ŧ":"T","ţ":"t","ť":"t","ŧ":"t","Ũ":"U","Ū":"U","Ŭ":"U","Ů":"U","Ű":"U","Ų":"U","ũ":"u","ū":"u","ŭ":"u","ů":"u","ű":"u","ų":"u","Ŵ":"W","ŵ":"w","Ŷ":"Y","ŷ":"y","Ÿ":"Y","Ź":"Z","Ż":"Z","Ž":"Z","ź":"z","ż":"z","ž":"z","Ĳ":"IJ","ĳ":"ij","Œ":"Oe","œ":"oe","ŉ":"'n","ſ":"s"},xn={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},kn={"&amp;":"&","&lt;":"<","&gt;":">","&quot;":'"',"&#39;":"'"},Sn={"\\":"\\","'":"'","\n":"n","\r":"r","\u2028":"u2028","\u2029":"u2029"},Tn=parseFloat,jn=parseInt,Rn="object"==typeof e&&e&&e.Object===Object&&e,Nn="object"==typeof self&&self&&self.Object===Object&&self,Mn=Rn||Nn||Function("return this")(),In="object"==typeof t&&t&&!t.nodeType&&t,An=In&&"object"==typeof r&&r&&!r.nodeType&&r,Dn=An&&An.exports===In,Ln=Dn&&Rn.process,Un=function(){try{return Ln&&Ln.binding&&Ln.binding("util")}catch(e){}}(),Fn=Un&&Un.isArrayBuffer,Vn=Un&&Un.isDate,Wn=Un&&Un.isMap,Bn=Un&&Un.isRegExp,qn=Un&&Un.isSet,Hn=Un&&Un.isTypedArray,zn=S("length"),Yn=T(Cn),Kn=T(xn),$n=T(kn),Gn=function e(t){function n(e){if(as(e)&&!mp(e)&&!(e instanceof _)){if(e instanceof o)return e;if(vc.call(e,"__wrapped__"))return ni(e)}return new o(e)}function r(){}function o(e,t){this.__wrapped__=e,this.__actions__=[],this.__chain__=!!t,this.__index__=0,this.__values__=oe}function _(e){this.__wrapped__=e,this.__actions__=[],this.__dir__=1,this.__filtered__=!1,this.__iteratees__=[],this.__takeCount__=De,this.__views__=[]}function T(){var e=new _(this.__wrapped__);return e.__actions__=Uo(this.__actions__),e.__dir__=this.__dir__,e.__filtered__=this.__filtered__,e.__iteratees__=Uo(this.__iteratees__),e.__takeCount__=this.__takeCount__,e.__views__=Uo(this.__views__),e}function Q(){if(this.__filtered__){var e=new _(this);e.__dir__=-1,e.__filtered__=!0}else e=this.clone(),e.__dir__*=-1;return e}function te(){var e=this.__wrapped__.value(),t=this.__dir__,n=mp(e),r=t<0,o=n?e.length:0,a=ka(0,o,this.__views__),i=a.start,u=a.end,s=u-i,l=r?u:i-1,c=this.__iteratees__,f=c.length,p=0,d=Yc(s,this.__takeCount__);if(!n||!r&&o==s&&d==s)return bo(e,this.__actions__);var h=[];e:for(;s--&&p<d;){l+=t;for(var y=-1,v=e[l];++y<f;){var m=c[y],g=m.iteratee,b=m.type,_=g(v);if(b==Re)v=_;else if(!_){if(b==je)continue e;break e}}h[p++]=v}return h}function ne(e){var t=-1,n=null==e?0:e.length;for(this.clear();++t<n;){var r=e[t];this.set(r[0],r[1])}}function Vt(){this.__data__=nf?nf(null):{},this.size=0}function Jt(e){var t=this.has(e)&&delete this.__data__[e];return this.size-=t?1:0,t}function Zt(e){var t=this.__data__;if(nf){var n=t[e];return n===se?oe:n}return vc.call(t,e)?t[e]:oe}function en(e){var t=this.__data__;return nf?t[e]!==oe:vc.call(t,e)}function tn(e,t){var n=this.__data__;return this.size+=this.has(e)?0:1,n[e]=nf&&t===oe?se:t,this}function nn(e){var t=-1,n=null==e?0:e.length;for(this.clear();++t<n;){var r=e[t];this.set(r[0],r[1])}}function rn(){this.__data__=[],this.size=0}function on(e){var t=this.__data__,n=Xn(t,e);return!(n<0)&&(n==t.length-1?t.pop():jc.call(t,n,1),--this.size,!0)}function an(e){var t=this.__data__,n=Xn(t,e);return n<0?oe:t[n][1]}function un(e){return Xn(this.__data__,e)>-1}function sn(e,t){var n=this.__data__,r=Xn(n,e);return r<0?(++this.size,n.push([e,t])):n[r][1]=t,this}function ln(e){var t=-1,n=null==e?0:e.length;for(this.clear();++t<n;){var r=e[t];this.set(r[0],r[1])}}function cn(){this.size=0,this.__data__={hash:new ne,map:new(Jc||nn),string:new ne}}function fn(e){var t=Oa(this,e).delete(e);return this.size-=t?1:0,t}function pn(e){return Oa(this,e).get(e)}function dn(e){return Oa(this,e).has(e)}function hn(e,t){var n=Oa(this,e),r=n.size;return n.set(e,t),this.size+=n.size==r?0:1,this}function mn(e){var t=-1,n=null==e?0:e.length;for(this.__data__=new ln;++t<n;)this.add(e[t])}function gn(e){return this.__data__.set(e,se),this}function bn(e){return this.__data__.has(e)}function _n(e){var t=this.__data__=new nn(e);this.size=t.size}function Cn(){this.__data__=new nn,this.size=0}function xn(e){var t=this.__data__,n=t.delete(e);return this.size=t.size,n}function kn(e){return this.__data__.get(e)}function Sn(e){return this.__data__.has(e)}function Rn(e,t){var n=this.__data__;if(n instanceof nn){var r=n.__data__;if(!Jc||r.length<ae-1)return r.push([e,t]),this.size=++n.size,this;n=this.__data__=new ln(r)}return n.set(e,t),this.size=n.size,this}function Nn(e,t){var n=mp(e),r=!n&&vp(e),o=!n&&!r&&bp(e),a=!n&&!r&&!o&&Pp(e),i=n||r||o||a,u=i?M(e.length,lc):[],s=u.length;for(var l in e)!t&&!vc.call(e,l)||i&&("length"==l||o&&("offset"==l||"parent"==l)||a&&("buffer"==l||"byteLength"==l||"byteOffset"==l)||Aa(l,s))||u.push(l);return u}function In(e){var t=e.length;return t?e[Zr(0,t-1)]:oe}function An(e,t){return Ja(Uo(e),nr(t,0,e.length))}function Ln(e){return Ja(Uo(e))}function Un(e,t,n){(n===oe||zu(e[t],n))&&(n!==oe||t in e)||er(e,t,n)}function zn(e,t,n){var r=e[t];vc.call(e,t)&&zu(r,n)&&(n!==oe||t in e)||er(e,t,n)}function Xn(e,t){for(var n=e.length;n--;)if(zu(e[n][0],t))return n;return-1}function Qn(e,t,n,r){return yf(e,function(e,o,a){t(r,e,n(e),a)}),r}function Jn(e,t){return e&&Fo(t,Vs(t),e)}function Zn(e,t){return e&&Fo(t,Ws(t),e)}function er(e,t,n){"__proto__"==t&&Ic?Ic(e,t,{configurable:!0,enumerable:!0,value:n,writable:!0}):e[t]=n}function tr(e,t){for(var n=-1,r=t.length,o=nc(r),a=null==e;++n<r;)o[n]=a?oe:Ls(e,t[n]);return o}function nr(e,t,n){return e===e&&(n!==oe&&(e=e<=n?e:n),t!==oe&&(e=e>=t?e:t)),e}function rr(e,t,n,r,o,a){var i,u=t&fe,s=t&pe,c=t&de;if(n&&(i=o?n(e,r,o,a):n(e)),i!==oe)return i;if(!os(e))return e;var f=mp(e);if(f){if(i=ja(e),!u)return Uo(e,i)}else{var p=kf(e),d=p==Ke||p==$e;if(bp(e))return xo(e,u);if(p==Je||p==Ve||d&&!o){if(i=s||d?{}:Ra(e),!u)return s?Wo(e,Zn(i,e)):Vo(e,Jn(i,e))}else{if(!Pn[p])return o?e:{};i=Na(e,p,rr,u)}}a||(a=new _n);var h=a.get(e);if(h)return h;a.set(e,i);var y=c?s?ba:ga:s?Ws:Vs,v=f?oe:y(e);return l(v||e,function(r,o){v&&(o=r,r=e[o]),zn(i,o,rr(r,t,n,o,e,a))}),i}function or(e){var t=Vs(e);return function(n){return ar(n,e,t)}}function ar(e,t,n){var r=n.length;if(null==e)return!r;for(e=uc(e);r--;){var o=n[r],a=t[o],i=e[o];if(i===oe&&!(o in e)||!a(i))return!1}return!0}function ir(e,t,n){if("function"!=typeof e)throw new cc(ue);return jf(function(){e.apply(oe,n)},t)}function ur(e,t,n,r){var o=-1,a=d,i=!0,u=e.length,s=[],l=t.length;if(!u)return s;n&&(t=y(t,A(n))),r?(a=h,i=!1):t.length>=ae&&(a=L,i=!1,t=new mn(t));e:for(;++o<u;){var c=e[o],f=null==n?c:n(c);if(c=r||0!==c?c:0,i&&f===f){for(var p=l;p--;)if(t[p]===f)continue e;s.push(c)}else a(t,f,r)||s.push(c)}return s}function sr(e,t){var n=!0;return yf(e,function(e,r,o){return n=!!t(e,r,o)}),n}function lr(e,t,n){for(var r=-1,o=e.length;++r<o;){var a=e[r],i=t(a);if(null!=i&&(u===oe?i===i&&!vs(i):n(i,u)))var u=i,s=a}return s}function cr(e,t,n,r){var o=e.length;for(n=Es(n),n<0&&(n=-n>o?0:o+n),r=r===oe||r>o?o:Es(r),r<0&&(r+=o),r=n>r?0:Os(r);n<r;)e[n++]=t;return e}function fr(e,t){var n=[];return yf(e,function(e,r,o){t(e,r,o)&&n.push(e)}),n}function pr(e,t,n,r,o){var a=-1,i=e.length;for(n||(n=Ia),o||(o=[]);++a<i;){var u=e[a];t>0&&n(u)?t>1?pr(u,t-1,n,r,o):v(o,u):r||(o[o.length]=u)}return o}function dr(e,t){return e&&mf(e,t,Vs)}function hr(e,t){return e&&gf(e,t,Vs)}function yr(e,t){return p(t,function(t){return ts(e[t])})}function vr(e,t){t=Po(t,e);for(var n=0,r=t.length;null!=e&&n<r;)e=e[Za(t[n++])];return n&&n==r?e:oe}function mr(e,t,n){var r=t(e);return mp(e)?r:v(r,n(e))}function gr(e){return null==e?e===oe?ot:Qe:Mc&&Mc in uc(e)?xa(e):Ya(e)}function br(e,t){return e>t}function _r(e,t){return null!=e&&vc.call(e,t)}function wr(e,t){return null!=e&&t in uc(e)}function Er(e,t,n){return e>=Yc(t,n)&&e<zc(t,n)}function Or(e,t,n){for(var r=n?h:d,o=e[0].length,a=e.length,i=a,u=nc(a),s=1/0,l=[];i--;){var c=e[i];i&&t&&(c=y(c,A(t))),s=Yc(c.length,s),u[i]=!n&&(t||o>=120&&c.length>=120)?new mn(i&&c):oe}c=e[0];var f=-1,p=u[0];e:for(;++f<o&&l.length<s;){var v=c[f],m=t?t(v):v;if(v=n||0!==v?v:0,!(p?L(p,m):r(l,m,n))){for(i=a;--i;){var g=u[i];if(!(g?L(g,m):r(e[i],m,n)))continue e}p&&p.push(m),l.push(v)}}return l}function Pr(e,t,n,r){return dr(e,function(e,o,a){t(r,n(e),o,a)}),r}function Cr(e,t,n){t=Po(t,e),e=$a(e,t);var r=null==e?e:e[Za(wi(t))];return null==r?oe:u(r,e,n)}function xr(e){return as(e)&&gr(e)==Ve}function kr(e){return as(e)&&gr(e)==ut}function Sr(e){return as(e)&&gr(e)==He}function Tr(e,t,n,r,o){return e===t||(null==e||null==t||!as(e)&&!as(t)?e!==e&&t!==t:jr(e,t,n,r,Tr,o))}function jr(e,t,n,r,o,a){var i=mp(e),u=mp(t),s=i?We:kf(e),l=u?We:kf(t);s=s==Ve?Je:s,l=l==Ve?Je:l;var c=s==Je,f=l==Je,p=s==l;if(p&&bp(e)){if(!bp(t))return!1;i=!0,c=!1}if(p&&!c)return a||(a=new _n),i||Pp(e)?ha(e,t,n,r,o,a):ya(e,t,s,n,r,o,a);if(!(n&he)){var d=c&&vc.call(e,"__wrapped__"),h=f&&vc.call(t,"__wrapped__");if(d||h){var y=d?e.value():e,v=h?t.value():t;return a||(a=new _n),o(y,v,n,r,a)}}return!!p&&(a||(a=new _n),va(e,t,n,r,o,a))}function Rr(e){return as(e)&&kf(e)==Ge}function Nr(e,t,n,r){var o=n.length,a=o,i=!r;if(null==e)return!a;for(e=uc(e);o--;){var u=n[o];if(i&&u[2]?u[1]!==e[u[0]]:!(u[0]in e))return!1}for(;++o<a;){u=n[o];var s=u[0],l=e[s],c=u[1];if(i&&u[2]){if(l===oe&&!(s in e))return!1}else{var f=new _n;if(r)var p=r(l,c,s,e,t,f);if(!(p===oe?Tr(c,l,he|ye,r,f):p))return!1}}return!0}function Mr(e){return!(!os(e)||Va(e))&&(ts(e)?Ec:Yt).test(ei(e))}function Ir(e){return as(e)&&gr(e)==et}function Ar(e){return as(e)&&kf(e)==tt}function Dr(e){return as(e)&&rs(e.length)&&!!On[gr(e)]}function Lr(e){return"function"==typeof e?e:null==e?jl:"object"==typeof e?mp(e)?qr(e[0],e[1]):Br(e):Ul(e)}function Ur(e){if(!Wa(e))return Hc(e);var t=[];for(var n in uc(e))vc.call(e,n)&&"constructor"!=n&&t.push(n);return t}function Fr(e){if(!os(e))return za(e);var t=Wa(e),n=[];for(var r in e)("constructor"!=r||!t&&vc.call(e,r))&&n.push(r);return n}function Vr(e,t){return e<t}function Wr(e,t){var n=-1,r=Yu(e)?nc(e.length):[];return yf(e,function(e,o,a){r[++n]=t(e,o,a)}),r}function Br(e){var t=Pa(e);return 1==t.length&&t[0][2]?qa(t[0][0],t[0][1]):function(n){return n===e||Nr(n,e,t)}}function qr(e,t){return La(e)&&Ba(t)?qa(Za(e),t):function(n){var r=Ls(n,e);return r===oe&&r===t?Fs(n,e):Tr(t,r,he|ye)}}function Hr(e,t,n,r,o){e!==t&&mf(t,function(a,i){if(os(a))o||(o=new _n),zr(e,t,i,n,Hr,r,o);else{var u=r?r(e[i],a,i+"",e,t,o):oe;u===oe&&(u=a),Un(e,i,u)}},Ws)}function zr(e,t,n,r,o,a,i){var u=e[n],s=t[n],l=i.get(s);if(l)return void Un(e,n,l);var c=a?a(u,s,n+"",e,t,i):oe,f=c===oe;if(f){var p=mp(s),d=!p&&bp(s),h=!p&&!d&&Pp(s);c=s,p||d||h?mp(u)?c=u:Ku(u)?c=Uo(u):d?(f=!1,c=xo(s,!0)):h?(f=!1,c=Mo(s,!0)):c=[]:ds(s)||vp(s)?(c=u,vp(u)?c=Cs(u):(!os(u)||r&&ts(u))&&(c=Ra(s))):f=!1}f&&(i.set(s,c),o(c,s,r,a,i),i.delete(s)),Un(e,n,c)}function Yr(e,t){var n=e.length;if(n)return t+=t<0?n:0,Aa(t,n)?e[t]:oe}function Kr(e,t,n){var r=-1;return t=y(t.length?t:[jl],A(Ea())),R(Wr(e,function(e,n,o){return{criteria:y(t,function(t){return t(e)}),index:++r,value:e}}),function(e,t){return Ao(e,t,n)})}function $r(e,t){return Gr(e,t,function(t,n){return Fs(e,n)})}function Gr(e,t,n){for(var r=-1,o=t.length,a={};++r<o;){var i=t[r],u=vr(e,i);n(u,i)&&ao(a,Po(i,e),u)}return a}function Xr(e){return function(t){return vr(t,e)}}function Qr(e,t,n,r){var o=r?C:P,a=-1,i=t.length,u=e;for(e===t&&(t=Uo(t)),n&&(u=y(e,A(n)));++a<i;)for(var s=0,l=t[a],c=n?n(l):l;(s=o(u,c,s,r))>-1;)u!==e&&jc.call(u,s,1),jc.call(e,s,1);return e}function Jr(e,t){for(var n=e?t.length:0,r=n-1;n--;){var o=t[n];if(n==r||o!==a){var a=o;Aa(o)?jc.call(e,o,1):vo(e,o)}}return e}function Zr(e,t){return e+Fc(Gc()*(t-e+1))}function eo(e,t,n,r){for(var o=-1,a=zc(Uc((t-e)/(n||1)),0),i=nc(a);a--;)i[r?a:++o]=e,e+=n;return i}function to(e,t){var n="";if(!e||t<1||t>Me)return n;do{t%2&&(n+=e),(t=Fc(t/2))&&(e+=e)}while(t);return n}function no(e,t){return Rf(Ka(e,t,jl),e+"")}function ro(e){return In(Zs(e))}function oo(e,t){var n=Zs(e);return Ja(n,nr(t,0,n.length))}function ao(e,t,n,r){if(!os(e))return e;t=Po(t,e);for(var o=-1,a=t.length,i=a-1,u=e;null!=u&&++o<a;){var s=Za(t[o]),l=n;if(o!=i){var c=u[s];l=r?r(c,s,u):oe,l===oe&&(l=os(c)?c:Aa(t[o+1])?[]:{})}zn(u,s,l),u=u[s]}return e}function io(e){return Ja(Zs(e))}function uo(e,t,n){var r=-1,o=e.length;t<0&&(t=-t>o?0:o+t),n=n>o?o:n,n<0&&(n+=o),o=t>n?0:n-t>>>0,t>>>=0;for(var a=nc(o);++r<o;)a[r]=e[r+t];return a}function so(e,t){var n;return yf(e,function(e,r,o){return!(n=t(e,r,o))}),!!n}function lo(e,t,n){var r=0,o=null==e?r:e.length;if("number"==typeof t&&t===t&&o<=Ue){for(;r<o;){var a=r+o>>>1,i=e[a];null!==i&&!vs(i)&&(n?i<=t:i<t)?r=a+1:o=a}return o}return co(e,t,jl,n)}function co(e,t,n,r){t=n(t);for(var o=0,a=null==e?0:e.length,i=t!==t,u=null===t,s=vs(t),l=t===oe;o<a;){var c=Fc((o+a)/2),f=n(e[c]),p=f!==oe,d=null===f,h=f===f,y=vs(f);if(i)var v=r||h;else v=l?h&&(r||p):u?h&&p&&(r||!d):s?h&&p&&!d&&(r||!y):!d&&!y&&(r?f<=t:f<t);v?o=c+1:a=c}return Yc(a,Le)}function fo(e,t){for(var n=-1,r=e.length,o=0,a=[];++n<r;){var i=e[n],u=t?t(i):i;if(!n||!zu(u,s)){var s=u;a[o++]=0===i?0:i}}return a}function po(e){return"number"==typeof e?e:vs(e)?Ae:+e}function ho(e){if("string"==typeof e)return e;if(mp(e))return y(e,ho)+"";if(vs(e))return df?df.call(e):"";var t=e+"";return"0"==t&&1/e==-Ne?"-0":t}function yo(e,t,n){var r=-1,o=d,a=e.length,i=!0,u=[],s=u;if(n)i=!1,o=h;else if(a>=ae){var l=t?null:Of(e);if(l)return G(l);i=!1,o=L,s=new mn}else s=t?[]:u;e:for(;++r<a;){var c=e[r],f=t?t(c):c;if(c=n||0!==c?c:0,i&&f===f){for(var p=s.length;p--;)if(s[p]===f)continue e;t&&s.push(f),u.push(c)}else o(s,f,n)||(s!==u&&s.push(f),u.push(c))}return u}function vo(e,t){return t=Po(t,e),null==(e=$a(e,t))||delete e[Za(wi(t))]}function mo(e,t,n,r){return ao(e,t,n(vr(e,t)),r)}function go(e,t,n,r){for(var o=e.length,a=r?o:-1;(r?a--:++a<o)&&t(e[a],a,e););return n?uo(e,r?0:a,r?a+1:o):uo(e,r?a+1:0,r?o:a)}function bo(e,t){var n=e;return n instanceof _&&(n=n.value()),m(t,function(e,t){return t.func.apply(t.thisArg,v([e],t.args))},n)}function _o(e,t,n){var r=e.length;if(r<2)return r?yo(e[0]):[];for(var o=-1,a=nc(r);++o<r;)for(var i=e[o],u=-1;++u<r;)u!=o&&(a[o]=ur(a[o]||i,e[u],t,n));return yo(pr(a,1),t,n)}function wo(e,t,n){for(var r=-1,o=e.length,a=t.length,i={};++r<o;){var u=r<a?t[r]:oe;n(i,e[r],u)}return i}function Eo(e){return Ku(e)?e:[]}function Oo(e){return"function"==typeof e?e:jl}function Po(e,t){return mp(e)?e:La(e,t)?[e]:Nf(ks(e))}function Co(e,t,n){var r=e.length;return n=n===oe?r:n,!t&&n>=r?e:uo(e,t,n)}function xo(e,t){if(t)return e.slice();var n=e.length,r=xc?xc(n):new e.constructor(n);return e.copy(r),r}function ko(e){var t=new e.constructor(e.byteLength);return new Cc(t).set(new Cc(e)),t}function So(e,t){var n=t?ko(e.buffer):e.buffer;return new e.constructor(n,e.byteOffset,e.byteLength)}function To(e,t,n){return m(t?n(Y(e),fe):Y(e),a,new e.constructor)}function jo(e){var t=new e.constructor(e.source,qt.exec(e));return t.lastIndex=e.lastIndex,t}function Ro(e,t,n){return m(t?n(G(e),fe):G(e),i,new e.constructor)}function No(e){return pf?uc(pf.call(e)):{}}function Mo(e,t){var n=t?ko(e.buffer):e.buffer;return new e.constructor(n,e.byteOffset,e.length)}function Io(e,t){if(e!==t){var n=e!==oe,r=null===e,o=e===e,a=vs(e),i=t!==oe,u=null===t,s=t===t,l=vs(t);if(!u&&!l&&!a&&e>t||a&&i&&s&&!u&&!l||r&&i&&s||!n&&s||!o)return 1;if(!r&&!a&&!l&&e<t||l&&n&&o&&!r&&!a||u&&n&&o||!i&&o||!s)return-1}return 0}function Ao(e,t,n){for(var r=-1,o=e.criteria,a=t.criteria,i=o.length,u=n.length;++r<i;){var s=Io(o[r],a[r]);if(s){if(r>=u)return s;return s*("desc"==n[r]?-1:1)}}return e.index-t.index}function Do(e,t,n,r){for(var o=-1,a=e.length,i=n.length,u=-1,s=t.length,l=zc(a-i,0),c=nc(s+l),f=!r;++u<s;)c[u]=t[u];for(;++o<i;)(f||o<a)&&(c[n[o]]=e[o]);for(;l--;)c[u++]=e[o++];return c}function Lo(e,t,n,r){for(var o=-1,a=e.length,i=-1,u=n.length,s=-1,l=t.length,c=zc(a-u,0),f=nc(c+l),p=!r;++o<c;)f[o]=e[o];for(var d=o;++s<l;)f[d+s]=t[s];for(;++i<u;)(p||o<a)&&(f[d+n[i]]=e[o++]);return f}function Uo(e,t){var n=-1,r=e.length;for(t||(t=nc(r));++n<r;)t[n]=e[n];return t}function Fo(e,t,n,r){var o=!n;n||(n={});for(var a=-1,i=t.length;++a<i;){var u=t[a],s=r?r(n[u],e[u],u,n,e):oe;s===oe&&(s=e[u]),o?er(n,u,s):zn(n,u,s)}return n}function Vo(e,t){return Fo(e,Cf(e),t)}function Wo(e,t){return Fo(e,xf(e),t)}function Bo(e,t){return function(n,r){var o=mp(n)?s:Qn,a=t?t():{};return o(n,e,Ea(r,2),a)}}function qo(e){return no(function(t,n){var r=-1,o=n.length,a=o>1?n[o-1]:oe,i=o>2?n[2]:oe;for(a=e.length>3&&"function"==typeof a?(o--,a):oe,i&&Da(n[0],n[1],i)&&(a=o<3?oe:a,o=1),t=uc(t);++r<o;){var u=n[r];u&&e(t,u,r,a)}return t})}function Ho(e,t){return function(n,r){if(null==n)return n;if(!Yu(n))return e(n,r);for(var o=n.length,a=t?o:-1,i=uc(n);(t?a--:++a<o)&&!1!==r(i[a],a,i););return n}}function zo(e){return function(t,n,r){for(var o=-1,a=uc(t),i=r(t),u=i.length;u--;){var s=i[e?u:++o];if(!1===n(a[s],s,a))break}return t}}function Yo(e,t,n){function r(){return(this&&this!==Mn&&this instanceof r?a:e).apply(o?n:this,arguments)}var o=t&ve,a=Go(e);return r}function Ko(e){return function(t){t=ks(t);var n=q(t)?ee(t):oe,r=n?n[0]:t.charAt(0),o=n?Co(n,1).join(""):t.slice(1);return r[e]()+o}}function $o(e){return function(t){return m(Cl(al(t).replace(yn,"")),e,"")}}function Go(e){return function(){var t=arguments;switch(t.length){case 0:return new e;case 1:return new e(t[0]);case 2:return new e(t[0],t[1]);case 3:return new e(t[0],t[1],t[2]);case 4:return new e(t[0],t[1],t[2],t[3]);case 5:return new e(t[0],t[1],t[2],t[3],t[4]);case 6:return new e(t[0],t[1],t[2],t[3],t[4],t[5]);case 7:return new e(t[0],t[1],t[2],t[3],t[4],t[5],t[6])}var n=hf(e.prototype),r=e.apply(n,t);return os(r)?r:n}}function Xo(e,t,n){function r(){for(var a=arguments.length,i=nc(a),s=a,l=wa(r);s--;)i[s]=arguments[s];var c=a<3&&i[0]!==l&&i[a-1]!==l?[]:$(i,l);return(a-=c.length)<n?ua(e,t,Zo,r.placeholder,oe,i,c,oe,oe,n-a):u(this&&this!==Mn&&this instanceof r?o:e,this,i)}var o=Go(e);return r}function Qo(e){return function(t,n,r){var o=uc(t);if(!Yu(t)){var a=Ea(n,3);t=Vs(t),n=function(e){return a(o[e],e,o)}}var i=e(t,n,r);return i>-1?o[a?t[i]:i]:oe}}function Jo(e){return ma(function(t){var n=t.length,r=n,a=o.prototype.thru;for(e&&t.reverse();r--;){var i=t[r];if("function"!=typeof i)throw new cc(ue);if(a&&!u&&"wrapper"==_a(i))var u=new o([],!0)}for(r=u?r:n;++r<n;){i=t[r];var s=_a(i),l="wrapper"==s?Pf(i):oe;u=l&&Fa(l[0])&&l[1]==(Oe|be|we|Pe)&&!l[4].length&&1==l[9]?u[_a(l[0])].apply(u,l[3]):1==i.length&&Fa(i)?u[s]():u.thru(i)}return function(){var e=arguments,r=e[0];if(u&&1==e.length&&mp(r))return u.plant(r).value();for(var o=0,a=n?t[o].apply(this,e):r;++o<n;)a=t[o].call(this,a);return a}})}function Zo(e,t,n,r,o,a,i,u,s,l){function c(){for(var m=arguments.length,g=nc(m),b=m;b--;)g[b]=arguments[b];if(h)var _=wa(c),w=V(g,_);if(r&&(g=Do(g,r,o,h)),a&&(g=Lo(g,a,i,h)),m-=w,h&&m<l){var E=$(g,_);return ua(e,t,Zo,c.placeholder,n,g,E,u,s,l-m)}var O=p?n:this,P=d?O[e]:e;return m=g.length,u?g=Ga(g,u):y&&m>1&&g.reverse(),f&&s<m&&(g.length=s),this&&this!==Mn&&this instanceof c&&(P=v||Go(P)),P.apply(O,g)}var f=t&Oe,p=t&ve,d=t&me,h=t&(be|_e),y=t&Ce,v=d?oe:Go(e);return c}function ea(e,t){return function(n,r){return Pr(n,e,t(r),{})}}function ta(e,t){return function(n,r){var o;if(n===oe&&r===oe)return t;if(n!==oe&&(o=n),r!==oe){if(o===oe)return r;"string"==typeof n||"string"==typeof r?(n=ho(n),r=ho(r)):(n=po(n),r=po(r)),o=e(n,r)}return o}}function na(e){return ma(function(t){return t=y(t,A(Ea())),no(function(n){var r=this;return e(t,function(e){return u(e,r,n)})})})}function ra(e,t){t=t===oe?" ":ho(t);var n=t.length;if(n<2)return n?to(t,e):t;var r=to(t,Uc(e/Z(t)));return q(t)?Co(ee(r),0,e).join(""):r.slice(0,e)}function oa(e,t,n,r){function o(){for(var t=-1,s=arguments.length,l=-1,c=r.length,f=nc(c+s),p=this&&this!==Mn&&this instanceof o?i:e;++l<c;)f[l]=r[l];for(;s--;)f[l++]=arguments[++t];return u(p,a?n:this,f)}var a=t&ve,i=Go(e);return o}function aa(e){return function(t,n,r){return r&&"number"!=typeof r&&Da(t,n,r)&&(n=r=oe),t=ws(t),n===oe?(n=t,t=0):n=ws(n),r=r===oe?t<n?1:-1:ws(r),eo(t,n,r,e)}}function ia(e){return function(t,n){return"string"==typeof t&&"string"==typeof n||(t=Ps(t),n=Ps(n)),e(t,n)}}function ua(e,t,n,r,o,a,i,u,s,l){var c=t&be,f=c?i:oe,p=c?oe:i,d=c?a:oe,h=c?oe:a;t|=c?we:Ee,(t&=~(c?Ee:we))&ge||(t&=~(ve|me));var y=[e,t,o,d,f,h,p,u,s,l],v=n.apply(oe,y);return Fa(e)&&Tf(v,y),v.placeholder=r,Xa(v,e,t)}function sa(e){var t=ic[e];return function(e,n){if(e=Ps(e),n=null==n?0:Yc(Es(n),292)){var r=(ks(e)+"e").split("e");return r=(ks(t(r[0]+"e"+(+r[1]+n)))+"e").split("e"),+(r[0]+"e"+(+r[1]-n))}return t(e)}}function la(e){return function(t){var n=kf(t);return n==Ge?Y(t):n==tt?X(t):I(t,e(t))}}function ca(e,t,n,r,o,a,i,u){var s=t&me;if(!s&&"function"!=typeof e)throw new cc(ue);var l=r?r.length:0;if(l||(t&=~(we|Ee),r=o=oe),i=i===oe?i:zc(Es(i),0),u=u===oe?u:Es(u),l-=o?o.length:0,t&Ee){var c=r,f=o;r=o=oe}var p=s?oe:Pf(e),d=[e,t,n,r,o,c,f,a,i,u];if(p&&Ha(d,p),e=d[0],t=d[1],n=d[2],r=d[3],o=d[4],u=d[9]=d[9]===oe?s?0:e.length:zc(d[9]-l,0),!u&&t&(be|_e)&&(t&=~(be|_e)),t&&t!=ve)h=t==be||t==_e?Xo(e,t,u):t!=we&&t!=(ve|we)||o.length?Zo.apply(oe,d):oa(e,t,n,r);else var h=Yo(e,t,n);return Xa((p?bf:Tf)(h,d),e,t)}function fa(e,t,n,r){return e===oe||zu(e,dc[n])&&!vc.call(r,n)?t:e}function pa(e,t,n,r,o,a){return os(e)&&os(t)&&(a.set(t,e),Hr(e,t,oe,pa,a),a.delete(t)),e}function da(e){return ds(e)?oe:e}function ha(e,t,n,r,o,a){var i=n&he,u=e.length,s=t.length;if(u!=s&&!(i&&s>u))return!1;var l=a.get(e);if(l&&a.get(t))return l==t;var c=-1,f=!0,p=n&ye?new mn:oe;for(a.set(e,t),a.set(t,e);++c<u;){var d=e[c],h=t[c];if(r)var y=i?r(h,d,c,t,e,a):r(d,h,c,e,t,a);if(y!==oe){if(y)continue;f=!1;break}if(p){if(!b(t,function(e,t){if(!L(p,t)&&(d===e||o(d,e,n,r,a)))return p.push(t)})){f=!1;break}}else if(d!==h&&!o(d,h,n,r,a)){f=!1;break}}return a.delete(e),a.delete(t),f}function ya(e,t,n,r,o,a,i){switch(n){case st:if(e.byteLength!=t.byteLength||e.byteOffset!=t.byteOffset)return!1;e=e.buffer,t=t.buffer;case ut:return!(e.byteLength!=t.byteLength||!a(new Cc(e),new Cc(t)));case qe:case He:case Xe:return zu(+e,+t);case Ye:return e.name==t.name&&e.message==t.message;case et:case nt:return e==t+"";case Ge:var u=Y;case tt:var s=r&he;if(u||(u=G),e.size!=t.size&&!s)return!1;var l=i.get(e);if(l)return l==t;r|=ye,i.set(e,t);var c=ha(u(e),u(t),r,o,a,i);return i.delete(e),c;case rt:if(pf)return pf.call(e)==pf.call(t)}return!1}function va(e,t,n,r,o,a){var i=n&he,u=ga(e),s=u.length;if(s!=ga(t).length&&!i)return!1;for(var l=s;l--;){var c=u[l];if(!(i?c in t:vc.call(t,c)))return!1}var f=a.get(e);if(f&&a.get(t))return f==t;var p=!0;a.set(e,t),a.set(t,e);for(var d=i;++l<s;){c=u[l];var h=e[c],y=t[c];if(r)var v=i?r(y,h,c,t,e,a):r(h,y,c,e,t,a);if(!(v===oe?h===y||o(h,y,n,r,a):v)){p=!1;break}d||(d="constructor"==c)}if(p&&!d){var m=e.constructor,g=t.constructor;m!=g&&"constructor"in e&&"constructor"in t&&!("function"==typeof m&&m instanceof m&&"function"==typeof g&&g instanceof g)&&(p=!1)}return a.delete(e),a.delete(t),p}function ma(e){return Rf(Ka(e,oe,di),e+"")}function ga(e){return mr(e,Vs,Cf)}function ba(e){return mr(e,Ws,xf)}function _a(e){for(var t=e.name+"",n=of[t],r=vc.call(of,t)?n.length:0;r--;){var o=n[r],a=o.func;if(null==a||a==e)return o.name}return t}function wa(e){return(vc.call(n,"placeholder")?n:e).placeholder}function Ea(){var e=n.iteratee||Rl;return e=e===Rl?Lr:e,arguments.length?e(arguments[0],arguments[1]):e}function Oa(e,t){var n=e.__data__;return Ua(t)?n["string"==typeof t?"string":"hash"]:n.map}function Pa(e){for(var t=Vs(e),n=t.length;n--;){var r=t[n],o=e[r];t[n]=[r,o,Ba(o)]}return t}function Ca(e,t){var n=B(e,t);return Mr(n)?n:oe}function xa(e){var t=vc.call(e,Mc),n=e[Mc];try{e[Mc]=oe;var r=!0}catch(e){}var o=bc.call(e);return r&&(t?e[Mc]=n:delete e[Mc]),o}function ka(e,t,n){for(var r=-1,o=n.length;++r<o;){var a=n[r],i=a.size;switch(a.type){case"drop":e+=i;break;case"dropRight":t-=i;break;case"take":t=Yc(t,e+i);break;case"takeRight":e=zc(e,t-i)}}return{start:e,end:t}}function Sa(e){var t=e.match(Ut);return t?t[1].split(Ft):[]}function Ta(e,t,n){t=Po(t,e);for(var r=-1,o=t.length,a=!1;++r<o;){var i=Za(t[r]);if(!(a=null!=e&&n(e,i)))break;e=e[i]}return a||++r!=o?a:!!(o=null==e?0:e.length)&&rs(o)&&Aa(i,o)&&(mp(e)||vp(e))}function ja(e){var t=e.length,n=e.constructor(t);return t&&"string"==typeof e[0]&&vc.call(e,"index")&&(n.index=e.index,n.input=e.input),n}function Ra(e){return"function"!=typeof e.constructor||Wa(e)?{}:hf(kc(e))}function Na(e,t,n,r){var o=e.constructor;switch(t){case ut:return ko(e);case qe:case He:return new o(+e);case st:return So(e,r);case lt:case ct:case ft:case pt:case dt:case ht:case yt:case vt:case mt:return Mo(e,r);case Ge:return To(e,r,n);case Xe:case nt:return new o(e);case et:return jo(e);case tt:return Ro(e,r,n);case rt:return No(e)}}function Ma(e,t){var n=t.length;if(!n)return e;var r=n-1;return t[r]=(n>1?"& ":"")+t[r],t=t.join(n>2?", ":" "),e.replace(Lt,"{\n/* [wrapped with "+t+"] */\n")}function Ia(e){return mp(e)||vp(e)||!!(Rc&&e&&e[Rc])}function Aa(e,t){return!!(t=null==t?Me:t)&&("number"==typeof e||$t.test(e))&&e>-1&&e%1==0&&e<t}function Da(e,t,n){if(!os(n))return!1;var r=typeof t;return!!("number"==r?Yu(n)&&Aa(t,n.length):"string"==r&&t in n)&&zu(n[t],e)}function La(e,t){if(mp(e))return!1;var n=typeof e;return!("number"!=n&&"symbol"!=n&&"boolean"!=n&&null!=e&&!vs(e))||(Tt.test(e)||!St.test(e)||null!=t&&e in uc(t))}function Ua(e){var t=typeof e;return"string"==t||"number"==t||"symbol"==t||"boolean"==t?"__proto__"!==e:null===e}function Fa(e){var t=_a(e),r=n[t];if("function"!=typeof r||!(t in _.prototype))return!1;if(e===r)return!0;var o=Pf(r);return!!o&&e===o[0]}function Va(e){return!!gc&&gc in e}function Wa(e){var t=e&&e.constructor;return e===("function"==typeof t&&t.prototype||dc)}function Ba(e){return e===e&&!os(e)}function qa(e,t){return function(n){return null!=n&&(n[e]===t&&(t!==oe||e in uc(n)))}}function Ha(e,t){var n=e[1],r=t[1],o=n|r,a=o<(ve|me|Oe),i=r==Oe&&n==be||r==Oe&&n==Pe&&e[7].length<=t[8]||r==(Oe|Pe)&&t[7].length<=t[8]&&n==be;if(!a&&!i)return e;r&ve&&(e[2]=t[2],o|=n&ve?0:ge);var u=t[3];if(u){var s=e[3];e[3]=s?Do(s,u,t[4]):u,e[4]=s?$(e[3],ce):t[4]}return u=t[5],u&&(s=e[5],e[5]=s?Lo(s,u,t[6]):u,e[6]=s?$(e[5],ce):t[6]),u=t[7],u&&(e[7]=u),r&Oe&&(e[8]=null==e[8]?t[8]:Yc(e[8],t[8])),null==e[9]&&(e[9]=t[9]),e[0]=t[0],e[1]=o,e}function za(e){var t=[];if(null!=e)for(var n in uc(e))t.push(n);return t}function Ya(e){return bc.call(e)}function Ka(e,t,n){return t=zc(t===oe?e.length-1:t,0),function(){for(var r=arguments,o=-1,a=zc(r.length-t,0),i=nc(a);++o<a;)i[o]=r[t+o];o=-1;for(var s=nc(t+1);++o<t;)s[o]=r[o];return s[t]=n(i),u(e,this,s)}}function $a(e,t){return t.length<2?e:vr(e,uo(t,0,-1))}function Ga(e,t){for(var n=e.length,r=Yc(t.length,n),o=Uo(e);r--;){var a=t[r];e[r]=Aa(a,n)?o[a]:oe}return e}function Xa(e,t,n){var r=t+"";return Rf(e,Ma(r,ti(Sa(r),n)))}function Qa(e){var t=0,n=0;return function(){var r=Kc(),o=Te-(r-n);if(n=r,o>0){if(++t>=Se)return arguments[0]}else t=0;return e.apply(oe,arguments)}}function Ja(e,t){var n=-1,r=e.length,o=r-1;for(t=t===oe?r:t;++n<t;){var a=Zr(n,o),i=e[a];e[a]=e[n],e[n]=i}return e.length=t,e}function Za(e){if("string"==typeof e||vs(e))return e;var t=e+"";return"0"==t&&1/e==-Ne?"-0":t}function ei(e){if(null!=e){try{return yc.call(e)}catch(e){}try{return e+""}catch(e){}}return""}function ti(e,t){return l(Fe,function(n){var r="_."+n[0];t&n[1]&&!d(e,r)&&e.push(r)}),e.sort()}function ni(e){if(e instanceof _)return e.clone();var t=new o(e.__wrapped__,e.__chain__);return t.__actions__=Uo(e.__actions__),t.__index__=e.__index__,t.__values__=e.__values__,t}function ri(e,t,n){t=(n?Da(e,t,n):t===oe)?1:zc(Es(t),0);var r=null==e?0:e.length;if(!r||t<1)return[];for(var o=0,a=0,i=nc(Uc(r/t));o<r;)i[a++]=uo(e,o,o+=t);return i}function oi(e){for(var t=-1,n=null==e?0:e.length,r=0,o=[];++t<n;){var a=e[t];a&&(o[r++]=a)}return o}function ai(){var e=arguments.length;if(!e)return[];for(var t=nc(e-1),n=arguments[0],r=e;r--;)t[r-1]=arguments[r];return v(mp(n)?Uo(n):[n],pr(t,1))}function ii(e,t,n){var r=null==e?0:e.length;return r?(t=n||t===oe?1:Es(t),uo(e,t<0?0:t,r)):[]}function ui(e,t,n){var r=null==e?0:e.length;return r?(t=n||t===oe?1:Es(t),t=r-t,uo(e,0,t<0?0:t)):[]}function si(e,t){return e&&e.length?go(e,Ea(t,3),!0,!0):[]}function li(e,t){return e&&e.length?go(e,Ea(t,3),!0):[]}function ci(e,t,n,r){var o=null==e?0:e.length;return o?(n&&"number"!=typeof n&&Da(e,t,n)&&(n=0,r=o),cr(e,t,n,r)):[]}function fi(e,t,n){var r=null==e?0:e.length;if(!r)return-1;var o=null==n?0:Es(n);return o<0&&(o=zc(r+o,0)),O(e,Ea(t,3),o)}function pi(e,t,n){var r=null==e?0:e.length;if(!r)return-1;var o=r-1;return n!==oe&&(o=Es(n),o=n<0?zc(r+o,0):Yc(o,r-1)),O(e,Ea(t,3),o,!0)}function di(e){return(null==e?0:e.length)?pr(e,1):[]}function hi(e){return(null==e?0:e.length)?pr(e,Ne):[]}function yi(e,t){return(null==e?0:e.length)?(t=t===oe?1:Es(t),pr(e,t)):[]}function vi(e){for(var t=-1,n=null==e?0:e.length,r={};++t<n;){var o=e[t];r[o[0]]=o[1]}return r}function mi(e){return e&&e.length?e[0]:oe}function gi(e,t,n){var r=null==e?0:e.length;if(!r)return-1;var o=null==n?0:Es(n);return o<0&&(o=zc(r+o,0)),P(e,t,o)}function bi(e){return(null==e?0:e.length)?uo(e,0,-1):[]}function _i(e,t){return null==e?"":qc.call(e,t)}function wi(e){var t=null==e?0:e.length;return t?e[t-1]:oe}function Ei(e,t,n){var r=null==e?0:e.length;if(!r)return-1;var o=r;return n!==oe&&(o=Es(n),o=o<0?zc(r+o,0):Yc(o,r-1)),t===t?J(e,t,o):O(e,x,o,!0)}function Oi(e,t){return e&&e.length?Yr(e,Es(t)):oe}function Pi(e,t){return e&&e.length&&t&&t.length?Qr(e,t):e}function Ci(e,t,n){return e&&e.length&&t&&t.length?Qr(e,t,Ea(n,2)):e}function xi(e,t,n){return e&&e.length&&t&&t.length?Qr(e,t,oe,n):e}function ki(e,t){var n=[];if(!e||!e.length)return n;var r=-1,o=[],a=e.length;for(t=Ea(t,3);++r<a;){var i=e[r];t(i,r,e)&&(n.push(i),o.push(r))}return Jr(e,o),n}function Si(e){return null==e?e:Xc.call(e)}function Ti(e,t,n){var r=null==e?0:e.length;return r?(n&&"number"!=typeof n&&Da(e,t,n)?(t=0,n=r):(t=null==t?0:Es(t),n=n===oe?r:Es(n)),uo(e,t,n)):[]}function ji(e,t){return lo(e,t)}function Ri(e,t,n){return co(e,t,Ea(n,2))}function Ni(e,t){var n=null==e?0:e.length;if(n){var r=lo(e,t);if(r<n&&zu(e[r],t))return r}return-1}function Mi(e,t){return lo(e,t,!0)}function Ii(e,t,n){return co(e,t,Ea(n,2),!0)}function Ai(e,t){if(null==e?0:e.length){var n=lo(e,t,!0)-1;if(zu(e[n],t))return n}return-1}function Di(e){return e&&e.length?fo(e):[]}function Li(e,t){return e&&e.length?fo(e,Ea(t,2)):[]}function Ui(e){var t=null==e?0:e.length;return t?uo(e,1,t):[]}function Fi(e,t,n){return e&&e.length?(t=n||t===oe?1:Es(t),uo(e,0,t<0?0:t)):[]}function Vi(e,t,n){var r=null==e?0:e.length;return r?(t=n||t===oe?1:Es(t),t=r-t,uo(e,t<0?0:t,r)):[]}function Wi(e,t){return e&&e.length?go(e,Ea(t,3),!1,!0):[]}function Bi(e,t){return e&&e.length?go(e,Ea(t,3)):[]}function qi(e){return e&&e.length?yo(e):[]}function Hi(e,t){return e&&e.length?yo(e,Ea(t,2)):[]}function zi(e,t){return t="function"==typeof t?t:oe,e&&e.length?yo(e,oe,t):[]}function Yi(e){if(!e||!e.length)return[];var t=0;return e=p(e,function(e){if(Ku(e))return t=zc(e.length,t),!0}),M(t,function(t){return y(e,S(t))})}function Ki(e,t){if(!e||!e.length)return[];var n=Yi(e);return null==t?n:y(n,function(e){return u(t,oe,e)})}function $i(e,t){return wo(e||[],t||[],zn)}function Gi(e,t){return wo(e||[],t||[],ao)}function Xi(e){var t=n(e);return t.__chain__=!0,t}function Qi(e,t){return t(e),e}function Ji(e,t){return t(e)}function Zi(){return Xi(this)}function eu(){return new o(this.value(),this.__chain__)}function tu(){this.__values__===oe&&(this.__values__=_s(this.value()));var e=this.__index__>=this.__values__.length;return{done:e,value:e?oe:this.__values__[this.__index__++]}}function nu(){return this}function ru(e){for(var t,n=this;n instanceof r;){var o=ni(n);o.__index__=0,o.__values__=oe,t?a.__wrapped__=o:t=o;var a=o;n=n.__wrapped__}return a.__wrapped__=e,t}function ou(){var e=this.__wrapped__;if(e instanceof _){var t=e;return this.__actions__.length&&(t=new _(this)),t=t.reverse(),t.__actions__.push({func:Ji,args:[Si],thisArg:oe}),new o(t,this.__chain__)}return this.thru(Si)}function au(){return bo(this.__wrapped__,this.__actions__)}function iu(e,t,n){var r=mp(e)?f:sr;return n&&Da(e,t,n)&&(t=oe),r(e,Ea(t,3))}function uu(e,t){return(mp(e)?p:fr)(e,Ea(t,3))}function su(e,t){return pr(hu(e,t),1)}function lu(e,t){return pr(hu(e,t),Ne)}function cu(e,t,n){return n=n===oe?1:Es(n),pr(hu(e,t),n)}function fu(e,t){return(mp(e)?l:yf)(e,Ea(t,3))}function pu(e,t){return(mp(e)?c:vf)(e,Ea(t,3))}function du(e,t,n,r){e=Yu(e)?e:Zs(e),n=n&&!r?Es(n):0;var o=e.length;return n<0&&(n=zc(o+n,0)),ys(e)?n<=o&&e.indexOf(t,n)>-1:!!o&&P(e,t,n)>-1}function hu(e,t){return(mp(e)?y:Wr)(e,Ea(t,3))}function yu(e,t,n,r){return null==e?[]:(mp(t)||(t=null==t?[]:[t]),n=r?oe:n,mp(n)||(n=null==n?[]:[n]),Kr(e,t,n))}function vu(e,t,n){var r=mp(e)?m:j,o=arguments.length<3;return r(e,Ea(t,4),n,o,yf)}function mu(e,t,n){var r=mp(e)?g:j,o=arguments.length<3;return r(e,Ea(t,4),n,o,vf)}function gu(e,t){return(mp(e)?p:fr)(e,Nu(Ea(t,3)))}function bu(e){return(mp(e)?In:ro)(e)}function _u(e,t,n){return t=(n?Da(e,t,n):t===oe)?1:Es(t),(mp(e)?An:oo)(e,t)}function wu(e){return(mp(e)?Ln:io)(e)}function Eu(e){if(null==e)return 0;if(Yu(e))return ys(e)?Z(e):e.length;var t=kf(e);return t==Ge||t==tt?e.size:Ur(e).length}function Ou(e,t,n){var r=mp(e)?b:so;return n&&Da(e,t,n)&&(t=oe),r(e,Ea(t,3))}function Pu(e,t){if("function"!=typeof t)throw new cc(ue);return e=Es(e),function(){if(--e<1)return t.apply(this,arguments)}}function Cu(e,t,n){return t=n?oe:t,t=e&&null==t?e.length:t,ca(e,Oe,oe,oe,oe,oe,t)}function xu(e,t){var n;if("function"!=typeof t)throw new cc(ue);return e=Es(e),function(){return--e>0&&(n=t.apply(this,arguments)),e<=1&&(t=oe),n}}function ku(e,t,n){t=n?oe:t;var r=ca(e,be,oe,oe,oe,oe,oe,t);return r.placeholder=ku.placeholder,r}function Su(e,t,n){t=n?oe:t;var r=ca(e,_e,oe,oe,oe,oe,oe,t);return r.placeholder=Su.placeholder,r}function Tu(e,t,n){function r(t){var n=p,r=d;return p=d=oe,g=t,y=e.apply(r,n)}function o(e){return g=e,v=jf(u,t),b?r(e):y}function a(e){var n=e-m,r=e-g,o=t-n;return _?Yc(o,h-r):o}function i(e){var n=e-m,r=e-g;return m===oe||n>=t||n<0||_&&r>=h}function u(){var e=ap();if(i(e))return s(e);v=jf(u,a(e))}function s(e){return v=oe,w&&p?r(e):(p=d=oe,y)}function l(){v!==oe&&Ef(v),g=0,p=m=d=v=oe}function c(){return v===oe?y:s(ap())}function f(){var e=ap(),n=i(e);if(p=arguments,d=this,m=e,n){if(v===oe)return o(m);if(_)return v=jf(u,t),r(m)}return v===oe&&(v=jf(u,t)),y}var p,d,h,y,v,m,g=0,b=!1,_=!1,w=!0;if("function"!=typeof e)throw new cc(ue);return t=Ps(t)||0,os(n)&&(b=!!n.leading,_="maxWait"in n,h=_?zc(Ps(n.maxWait)||0,t):h,w="trailing"in n?!!n.trailing:w),f.cancel=l,f.flush=c,f}function ju(e){return ca(e,Ce)}function Ru(e,t){if("function"!=typeof e||null!=t&&"function"!=typeof t)throw new cc(ue);var n=function(){var r=arguments,o=t?t.apply(this,r):r[0],a=n.cache;if(a.has(o))return a.get(o);var i=e.apply(this,r);return n.cache=a.set(o,i)||a,i};return n.cache=new(Ru.Cache||ln),n}function Nu(e){if("function"!=typeof e)throw new cc(ue);return function(){var t=arguments;switch(t.length){case 0:return!e.call(this);case 1:return!e.call(this,t[0]);case 2:return!e.call(this,t[0],t[1]);case 3:return!e.call(this,t[0],t[1],t[2])}return!e.apply(this,t)}}function Mu(e){return xu(2,e)}function Iu(e,t){if("function"!=typeof e)throw new cc(ue);return t=t===oe?t:Es(t),no(e,t)}function Au(e,t){if("function"!=typeof e)throw new cc(ue);return t=null==t?0:zc(Es(t),0),no(function(n){var r=n[t],o=Co(n,0,t);return r&&v(o,r),u(e,this,o)})}function Du(e,t,n){var r=!0,o=!0;if("function"!=typeof e)throw new cc(ue);return os(n)&&(r="leading"in n?!!n.leading:r,o="trailing"in n?!!n.trailing:o),Tu(e,t,{leading:r,maxWait:t,trailing:o})}function Lu(e){return Cu(e,1)}function Uu(e,t){return fp(Oo(t),e)}function Fu(){if(!arguments.length)return[];var e=arguments[0];return mp(e)?e:[e]}function Vu(e){return rr(e,de)}function Wu(e,t){return t="function"==typeof t?t:oe,rr(e,de,t)}function Bu(e){return rr(e,fe|de)}function qu(e,t){return t="function"==typeof t?t:oe,rr(e,fe|de,t)}function Hu(e,t){return null==t||ar(e,t,Vs(t))}function zu(e,t){return e===t||e!==e&&t!==t}function Yu(e){return null!=e&&rs(e.length)&&!ts(e)}function Ku(e){return as(e)&&Yu(e)}function $u(e){return!0===e||!1===e||as(e)&&gr(e)==qe}function Gu(e){return as(e)&&1===e.nodeType&&!ds(e)}function Xu(e){if(null==e)return!0;if(Yu(e)&&(mp(e)||"string"==typeof e||"function"==typeof e.splice||bp(e)||Pp(e)||vp(e)))return!e.length;var t=kf(e);if(t==Ge||t==tt)return!e.size;if(Wa(e))return!Ur(e).length;for(var n in e)if(vc.call(e,n))return!1;return!0}function Qu(e,t){return Tr(e,t)}function Ju(e,t,n){n="function"==typeof n?n:oe;var r=n?n(e,t):oe;return r===oe?Tr(e,t,oe,n):!!r}function Zu(e){if(!as(e))return!1;var t=gr(e);return t==Ye||t==ze||"string"==typeof e.message&&"string"==typeof e.name&&!ds(e)}function es(e){return"number"==typeof e&&Bc(e)}function ts(e){if(!os(e))return!1;var t=gr(e);return t==Ke||t==$e||t==Be||t==Ze}function ns(e){return"number"==typeof e&&e==Es(e)}function rs(e){return"number"==typeof e&&e>-1&&e%1==0&&e<=Me}function os(e){var t=typeof e;return null!=e&&("object"==t||"function"==t)}function as(e){return null!=e&&"object"==typeof e}function is(e,t){return e===t||Nr(e,t,Pa(t))}function us(e,t,n){return n="function"==typeof n?n:oe,Nr(e,t,Pa(t),n)}function ss(e){return ps(e)&&e!=+e}function ls(e){if(Sf(e))throw new oc(ie);return Mr(e)}function cs(e){return null===e}function fs(e){return null==e}function ps(e){return"number"==typeof e||as(e)&&gr(e)==Xe}function ds(e){if(!as(e)||gr(e)!=Je)return!1;var t=kc(e);if(null===t)return!0;var n=vc.call(t,"constructor")&&t.constructor;return"function"==typeof n&&n instanceof n&&yc.call(n)==_c}function hs(e){return ns(e)&&e>=-Me&&e<=Me}function ys(e){return"string"==typeof e||!mp(e)&&as(e)&&gr(e)==nt}function vs(e){return"symbol"==typeof e||as(e)&&gr(e)==rt}function ms(e){return e===oe}function gs(e){return as(e)&&kf(e)==at}function bs(e){return as(e)&&gr(e)==it}function _s(e){if(!e)return[];if(Yu(e))return ys(e)?ee(e):Uo(e);if(Nc&&e[Nc])return z(e[Nc]());var t=kf(e);return(t==Ge?Y:t==tt?G:Zs)(e)}function ws(e){if(!e)return 0===e?e:0;if((e=Ps(e))===Ne||e===-Ne){return(e<0?-1:1)*Ie}return e===e?e:0}function Es(e){var t=ws(e),n=t%1;return t===t?n?t-n:t:0}function Os(e){return e?nr(Es(e),0,De):0}function Ps(e){if("number"==typeof e)return e;if(vs(e))return Ae;if(os(e)){var t="function"==typeof e.valueOf?e.valueOf():e;e=os(t)?t+"":t}if("string"!=typeof e)return 0===e?e:+e;e=e.replace(It,"");var n=zt.test(e);return n||Kt.test(e)?jn(e.slice(2),n?2:8):Ht.test(e)?Ae:+e}function Cs(e){return Fo(e,Ws(e))}function xs(e){return e?nr(Es(e),-Me,Me):0===e?e:0}function ks(e){return null==e?"":ho(e)}function Ss(e,t){var n=hf(e);return null==t?n:Jn(n,t)}function Ts(e,t){return E(e,Ea(t,3),dr)}function js(e,t){return E(e,Ea(t,3),hr)}function Rs(e,t){return null==e?e:mf(e,Ea(t,3),Ws)}function Ns(e,t){return null==e?e:gf(e,Ea(t,3),Ws)}function Ms(e,t){return e&&dr(e,Ea(t,3))}function Is(e,t){return e&&hr(e,Ea(t,3))}function As(e){return null==e?[]:yr(e,Vs(e))}function Ds(e){return null==e?[]:yr(e,Ws(e))}function Ls(e,t,n){var r=null==e?oe:vr(e,t);return r===oe?n:r}function Us(e,t){return null!=e&&Ta(e,t,_r)}function Fs(e,t){return null!=e&&Ta(e,t,wr)}function Vs(e){return Yu(e)?Nn(e):Ur(e)}function Ws(e){return Yu(e)?Nn(e,!0):Fr(e)}function Bs(e,t){var n={};return t=Ea(t,3),dr(e,function(e,r,o){er(n,t(e,r,o),e)}),n}function qs(e,t){var n={};return t=Ea(t,3),dr(e,function(e,r,o){er(n,r,t(e,r,o))}),n}function Hs(e,t){return zs(e,Nu(Ea(t)))}function zs(e,t){if(null==e)return{};var n=y(ba(e),function(e){return[e]});return t=Ea(t),Gr(e,n,function(e,n){return t(e,n[0])})}function Ys(e,t,n){t=Po(t,e);var r=-1,o=t.length;for(o||(o=1,e=oe);++r<o;){var a=null==e?oe:e[Za(t[r])];a===oe&&(r=o,a=n),e=ts(a)?a.call(e):a}return e}function Ks(e,t,n){return null==e?e:ao(e,t,n)}function $s(e,t,n,r){return r="function"==typeof r?r:oe,null==e?e:ao(e,t,n,r)}function Gs(e,t,n){var r=mp(e),o=r||bp(e)||Pp(e);if(t=Ea(t,4),null==n){var a=e&&e.constructor;n=o?r?new a:[]:os(e)&&ts(a)?hf(kc(e)):{}}return(o?l:dr)(e,function(e,r,o){return t(n,e,r,o)}),n}function Xs(e,t){return null==e||vo(e,t)}function Qs(e,t,n){return null==e?e:mo(e,t,Oo(n))}function Js(e,t,n,r){return r="function"==typeof r?r:oe,null==e?e:mo(e,t,Oo(n),r)}function Zs(e){return null==e?[]:D(e,Vs(e))}function el(e){return null==e?[]:D(e,Ws(e))}function tl(e,t,n){return n===oe&&(n=t,t=oe),n!==oe&&(n=Ps(n),n=n===n?n:0),t!==oe&&(t=Ps(t),t=t===t?t:0),nr(Ps(e),t,n)}function nl(e,t,n){return t=ws(t),n===oe?(n=t,t=0):n=ws(n),e=Ps(e),Er(e,t,n)}function rl(e,t,n){if(n&&"boolean"!=typeof n&&Da(e,t,n)&&(t=n=oe),n===oe&&("boolean"==typeof t?(n=t,t=oe):"boolean"==typeof e&&(n=e,e=oe)),e===oe&&t===oe?(e=0,t=1):(e=ws(e),t===oe?(t=e,e=0):t=ws(t)),e>t){var r=e;e=t,t=r}if(n||e%1||t%1){var o=Gc();return Yc(e+o*(t-e+Tn("1e-"+((o+"").length-1))),t)}return Zr(e,t)}function ol(e){return Xp(ks(e).toLowerCase())}function al(e){return(e=ks(e))&&e.replace(Gt,Yn).replace(vn,"")}function il(e,t,n){e=ks(e),t=ho(t);var r=e.length;n=n===oe?r:nr(Es(n),0,r);var o=n;return(n-=t.length)>=0&&e.slice(n,o)==t}function ul(e){return e=ks(e),e&&Pt.test(e)?e.replace(Et,Kn):e}function sl(e){return e=ks(e),e&&Mt.test(e)?e.replace(Nt,"\\$&"):e}function ll(e,t,n){e=ks(e),t=Es(t);var r=t?Z(e):0;if(!t||r>=t)return e;var o=(t-r)/2;return ra(Fc(o),n)+e+ra(Uc(o),n)}function cl(e,t,n){e=ks(e),t=Es(t);var r=t?Z(e):0;return t&&r<t?e+ra(t-r,n):e}function fl(e,t,n){e=ks(e),t=Es(t);var r=t?Z(e):0;return t&&r<t?ra(t-r,n)+e:e}function pl(e,t,n){return n||null==t?t=0:t&&(t=+t),$c(ks(e).replace(At,""),t||0)}function dl(e,t,n){return t=(n?Da(e,t,n):t===oe)?1:Es(t),to(ks(e),t)}function hl(){var e=arguments,t=ks(e[0]);return e.length<3?t:t.replace(e[1],e[2])}function yl(e,t,n){return n&&"number"!=typeof n&&Da(e,t,n)&&(t=n=oe),(n=n===oe?De:n>>>0)?(e=ks(e),e&&("string"==typeof t||null!=t&&!Ep(t))&&!(t=ho(t))&&q(e)?Co(ee(e),0,n):e.split(t,n)):[]}function vl(e,t,n){return e=ks(e),n=null==n?0:nr(Es(n),0,e.length),t=ho(t),e.slice(n,n+t.length)==t}function ml(e,t,r){var o=n.templateSettings;r&&Da(e,t,r)&&(t=oe),e=ks(e),t=Tp({},t,o,fa);var a,i,u=Tp({},t.imports,o.imports,fa),s=Vs(u),l=D(u,s),c=0,f=t.interpolate||Xt,p="__p += '",d=sc((t.escape||Xt).source+"|"+f.source+"|"+(f===kt?Bt:Xt).source+"|"+(t.evaluate||Xt).source+"|$","g"),h="//# sourceURL="+("sourceURL"in t?t.sourceURL:"lodash.templateSources["+ ++En+"]")+"\n";e.replace(d,function(t,n,r,o,u,s){return r||(r=o),p+=e.slice(c,s).replace(Qt,W),n&&(a=!0,p+="' +\n__e("+n+") +\n'"),u&&(i=!0,p+="';\n"+u+";\n__p += '"),r&&(p+="' +\n((__t = ("+r+")) == null ? '' : __t) +\n'"),c=s+t.length,t}),p+="';\n";var y=t.variable;y||(p="with (obj) {\n"+p+"\n}\n"),p=(i?p.replace(gt,""):p).replace(bt,"$1").replace(_t,"$1;"),p="function("+(y||"obj")+") {\n"+(y?"":"obj || (obj = {});\n")+"var __t, __p = ''"+(a?", __e = _.escape":"")+(i?", __j = Array.prototype.join;\nfunction print() { __p += __j.call(arguments, '') }\n":";\n")+p+"return __p\n}";var v=Qp(function(){return ac(s,h+"return "+p).apply(oe,l)});if(v.source=p,Zu(v))throw v;return v}function gl(e){return ks(e).toLowerCase()}function bl(e){return ks(e).toUpperCase()}function _l(e,t,n){if((e=ks(e))&&(n||t===oe))return e.replace(It,"");if(!e||!(t=ho(t)))return e;var r=ee(e),o=ee(t);return Co(r,U(r,o),F(r,o)+1).join("")}function wl(e,t,n){if((e=ks(e))&&(n||t===oe))return e.replace(Dt,"");if(!e||!(t=ho(t)))return e;var r=ee(e);return Co(r,0,F(r,ee(t))+1).join("")}function El(e,t,n){if((e=ks(e))&&(n||t===oe))return e.replace(At,"");if(!e||!(t=ho(t)))return e;var r=ee(e);return Co(r,U(r,ee(t))).join("")}function Ol(e,t){var n=xe,r=ke;if(os(t)){var o="separator"in t?t.separator:o;n="length"in t?Es(t.length):n,r="omission"in t?ho(t.omission):r}e=ks(e);var a=e.length;if(q(e)){var i=ee(e);a=i.length}if(n>=a)return e;var u=n-Z(r);if(u<1)return r;var s=i?Co(i,0,u).join(""):e.slice(0,u);if(o===oe)return s+r;if(i&&(u+=s.length-u),Ep(o)){if(e.slice(u).search(o)){var l,c=s;for(o.global||(o=sc(o.source,ks(qt.exec(o))+"g")),o.lastIndex=0;l=o.exec(c);)var f=l.index;s=s.slice(0,f===oe?u:f)}}else if(e.indexOf(ho(o),u)!=u){var p=s.lastIndexOf(o);p>-1&&(s=s.slice(0,p))}return s+r}function Pl(e){return e=ks(e),e&&Ot.test(e)?e.replace(wt,$n):e}function Cl(e,t,n){return e=ks(e),t=n?oe:t,t===oe?H(e)?re(e):w(e):e.match(t)||[]}function xl(e){var t=null==e?0:e.length,n=Ea();return e=t?y(e,function(e){if("function"!=typeof e[1])throw new cc(ue);return[n(e[0]),e[1]]}):[],no(function(n){for(var r=-1;++r<t;){var o=e[r];if(u(o[0],this,n))return u(o[1],this,n)}})}function kl(e){return or(rr(e,fe))}function Sl(e){return function(){return e}}function Tl(e,t){return null==e||e!==e?t:e}function jl(e){return e}function Rl(e){return Lr("function"==typeof e?e:rr(e,fe))}function Nl(e){return Br(rr(e,fe))}function Ml(e,t){return qr(e,rr(t,fe))}function Il(e,t,n){var r=Vs(t),o=yr(t,r);null!=n||os(t)&&(o.length||!r.length)||(n=t,t=e,e=this,o=yr(t,Vs(t)));var a=!(os(n)&&"chain"in n&&!n.chain),i=ts(e);return l(o,function(n){var r=t[n];e[n]=r,i&&(e.prototype[n]=function(){var t=this.__chain__;if(a||t){var n=e(this.__wrapped__);return(n.__actions__=Uo(this.__actions__)).push({func:r,args:arguments,thisArg:e}),n.__chain__=t,n}return r.apply(e,v([this.value()],arguments))})}),e}function Al(){return Mn._===this&&(Mn._=wc),this}function Dl(){}function Ll(e){return e=Es(e),no(function(t){return Yr(t,e)})}function Ul(e){return La(e)?S(Za(e)):Xr(e)}function Fl(e){return function(t){return null==e?oe:vr(e,t)}}function Vl(){return[]}function Wl(){return!1}function Bl(){return{}}function ql(){return""}function Hl(){return!0}function zl(e,t){if((e=Es(e))<1||e>Me)return[];var n=De,r=Yc(e,De);t=Ea(t),e-=De;for(var o=M(r,t);++n<e;)t(n);return o}function Yl(e){return mp(e)?y(e,Za):vs(e)?[e]:Uo(Nf(ks(e)))}function Kl(e){var t=++mc;return ks(e)+t}function $l(e){return e&&e.length?lr(e,jl,br):oe}function Gl(e,t){return e&&e.length?lr(e,Ea(t,2),br):oe}function Xl(e){return k(e,jl)}function Ql(e,t){return k(e,Ea(t,2))}function Jl(e){return e&&e.length?lr(e,jl,Vr):oe}function Zl(e,t){return e&&e.length?lr(e,Ea(t,2),Vr):oe}function ec(e){return e&&e.length?N(e,jl):0}function tc(e,t){return e&&e.length?N(e,Ea(t,2)):0}t=null==t?Mn:Gn.defaults(Mn.Object(),t,Gn.pick(Mn,wn));var nc=t.Array,rc=t.Date,oc=t.Error,ac=t.Function,ic=t.Math,uc=t.Object,sc=t.RegExp,lc=t.String,cc=t.TypeError,fc=nc.prototype,pc=ac.prototype,dc=uc.prototype,hc=t["__core-js_shared__"],yc=pc.toString,vc=dc.hasOwnProperty,mc=0,gc=function(){var e=/[^.]+$/.exec(hc&&hc.keys&&hc.keys.IE_PROTO||"");return e?"Symbol(src)_1."+e:""}(),bc=dc.toString,_c=yc.call(uc),wc=Mn._,Ec=sc("^"+yc.call(vc).replace(Nt,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$"),Oc=Dn?t.Buffer:oe,Pc=t.Symbol,Cc=t.Uint8Array,xc=Oc?Oc.allocUnsafe:oe,kc=K(uc.getPrototypeOf,uc),Sc=uc.create,Tc=dc.propertyIsEnumerable,jc=fc.splice,Rc=Pc?Pc.isConcatSpreadable:oe,Nc=Pc?Pc.iterator:oe,Mc=Pc?Pc.toStringTag:oe,Ic=function(){try{var e=Ca(uc,"defineProperty");return e({},"",{}),e}catch(e){}}(),Ac=t.clearTimeout!==Mn.clearTimeout&&t.clearTimeout,Dc=rc&&rc.now!==Mn.Date.now&&rc.now,Lc=t.setTimeout!==Mn.setTimeout&&t.setTimeout,Uc=ic.ceil,Fc=ic.floor,Vc=uc.getOwnPropertySymbols,Wc=Oc?Oc.isBuffer:oe,Bc=t.isFinite,qc=fc.join,Hc=K(uc.keys,uc),zc=ic.max,Yc=ic.min,Kc=rc.now,$c=t.parseInt,Gc=ic.random,Xc=fc.reverse,Qc=Ca(t,"DataView"),Jc=Ca(t,"Map"),Zc=Ca(t,"Promise"),ef=Ca(t,"Set"),tf=Ca(t,"WeakMap"),nf=Ca(uc,"create"),rf=tf&&new tf,of={},af=ei(Qc),uf=ei(Jc),sf=ei(Zc),lf=ei(ef),cf=ei(tf),ff=Pc?Pc.prototype:oe,pf=ff?ff.valueOf:oe,df=ff?ff.toString:oe,hf=function(){function e(){}return function(t){if(!os(t))return{};if(Sc)return Sc(t);e.prototype=t;var n=new e;return e.prototype=oe,n}}();n.templateSettings={escape:Ct,evaluate:xt,interpolate:kt,variable:"",imports:{_:n}},n.prototype=r.prototype,n.prototype.constructor=n,o.prototype=hf(r.prototype),o.prototype.constructor=o,_.prototype=hf(r.prototype),_.prototype.constructor=_,ne.prototype.clear=Vt,ne.prototype.delete=Jt,ne.prototype.get=Zt,ne.prototype.has=en,ne.prototype.set=tn,nn.prototype.clear=rn,nn.prototype.delete=on,nn.prototype.get=an,nn.prototype.has=un,nn.prototype.set=sn,ln.prototype.clear=cn,ln.prototype.delete=fn,ln.prototype.get=pn,ln.prototype.has=dn,ln.prototype.set=hn,mn.prototype.add=mn.prototype.push=gn,mn.prototype.has=bn,_n.prototype.clear=Cn,_n.prototype.delete=xn,_n.prototype.get=kn,_n.prototype.has=Sn,_n.prototype.set=Rn;var yf=Ho(dr),vf=Ho(hr,!0),mf=zo(),gf=zo(!0),bf=rf?function(e,t){return rf.set(e,t),e}:jl,_f=Ic?function(e,t){return Ic(e,"toString",{configurable:!0,enumerable:!1,value:Sl(t),writable:!0})}:jl,wf=no,Ef=Ac||function(e){return Mn.clearTimeout(e)},Of=ef&&1/G(new ef([,-0]))[1]==Ne?function(e){return new ef(e)}:Dl,Pf=rf?function(e){return rf.get(e)}:Dl,Cf=Vc?function(e){return null==e?[]:(e=uc(e),p(Vc(e),function(t){return Tc.call(e,t)}))}:Vl,xf=Vc?function(e){for(var t=[];e;)v(t,Cf(e)),e=kc(e);return t}:Vl,kf=gr;(Qc&&kf(new Qc(new ArrayBuffer(1)))!=st||Jc&&kf(new Jc)!=Ge||Zc&&"[object Promise]"!=kf(Zc.resolve())||ef&&kf(new ef)!=tt||tf&&kf(new tf)!=at)&&(kf=function(e){var t=gr(e),n=t==Je?e.constructor:oe,r=n?ei(n):"";if(r)switch(r){case af:return st;case uf:return Ge;case sf:return"[object Promise]";case lf:return tt;case cf:return at}return t});var Sf=hc?ts:Wl,Tf=Qa(bf),jf=Lc||function(e,t){return Mn.setTimeout(e,t)},Rf=Qa(_f),Nf=function(e){var t=Ru(e,function(e){return n.size===le&&n.clear(),e}),n=t.cache;return t}(function(e){var t=[];return jt.test(e)&&t.push(""),e.replace(Rt,function(e,n,r,o){t.push(r?o.replace(Wt,"$1"):n||e)}),t}),Mf=no(function(e,t){return Ku(e)?ur(e,pr(t,1,Ku,!0)):[]}),If=no(function(e,t){var n=wi(t);return Ku(n)&&(n=oe),Ku(e)?ur(e,pr(t,1,Ku,!0),Ea(n,2)):[]}),Af=no(function(e,t){var n=wi(t);return Ku(n)&&(n=oe),Ku(e)?ur(e,pr(t,1,Ku,!0),oe,n):[]}),Df=no(function(e){var t=y(e,Eo);return t.length&&t[0]===e[0]?Or(t):[]}),Lf=no(function(e){var t=wi(e),n=y(e,Eo);return t===wi(n)?t=oe:n.pop(),n.length&&n[0]===e[0]?Or(n,Ea(t,2)):[]}),Uf=no(function(e){var t=wi(e),n=y(e,Eo);return t="function"==typeof t?t:oe,t&&n.pop(),n.length&&n[0]===e[0]?Or(n,oe,t):[]}),Ff=no(Pi),Vf=ma(function(e,t){var n=null==e?0:e.length,r=tr(e,t);return Jr(e,y(t,function(e){return Aa(e,n)?+e:e}).sort(Io)),r}),Wf=no(function(e){return yo(pr(e,1,Ku,!0))}),Bf=no(function(e){var t=wi(e);return Ku(t)&&(t=oe),yo(pr(e,1,Ku,!0),Ea(t,2))}),qf=no(function(e){var t=wi(e);return t="function"==typeof t?t:oe,yo(pr(e,1,Ku,!0),oe,t)}),Hf=no(function(e,t){return Ku(e)?ur(e,t):[]}),zf=no(function(e){return _o(p(e,Ku))}),Yf=no(function(e){var t=wi(e);return Ku(t)&&(t=oe),_o(p(e,Ku),Ea(t,2))}),Kf=no(function(e){var t=wi(e);return t="function"==typeof t?t:oe,_o(p(e,Ku),oe,t)}),$f=no(Yi),Gf=no(function(e){var t=e.length,n=t>1?e[t-1]:oe;return n="function"==typeof n?(e.pop(),n):oe,Ki(e,n)}),Xf=ma(function(e){var t=e.length,n=t?e[0]:0,r=this.__wrapped__,a=function(t){return tr(t,e)};return!(t>1||this.__actions__.length)&&r instanceof _&&Aa(n)?(r=r.slice(n,+n+(t?1:0)),r.__actions__.push({func:Ji,args:[a],thisArg:oe}),new o(r,this.__chain__).thru(function(e){return t&&!e.length&&e.push(oe),e})):this.thru(a)}),Qf=Bo(function(e,t,n){vc.call(e,n)?++e[n]:er(e,n,1)}),Jf=Qo(fi),Zf=Qo(pi),ep=Bo(function(e,t,n){vc.call(e,n)?e[n].push(t):er(e,n,[t])}),tp=no(function(e,t,n){var r=-1,o="function"==typeof t,a=Yu(e)?nc(e.length):[];return yf(e,function(e){a[++r]=o?u(t,e,n):Cr(e,t,n)}),a}),np=Bo(function(e,t,n){er(e,n,t)}),rp=Bo(function(e,t,n){e[n?0:1].push(t)},function(){return[[],[]]}),op=no(function(e,t){if(null==e)return[];var n=t.length;return n>1&&Da(e,t[0],t[1])?t=[]:n>2&&Da(t[0],t[1],t[2])&&(t=[t[0]]),Kr(e,pr(t,1),[])}),ap=Dc||function(){return Mn.Date.now()},ip=no(function(e,t,n){var r=ve;if(n.length){var o=$(n,wa(ip));r|=we}return ca(e,r,t,n,o)}),up=no(function(e,t,n){var r=ve|me;if(n.length){var o=$(n,wa(up));r|=we}return ca(t,r,e,n,o)}),sp=no(function(e,t){return ir(e,1,t)}),lp=no(function(e,t,n){return ir(e,Ps(t)||0,n)});Ru.Cache=ln;var cp=wf(function(e,t){t=1==t.length&&mp(t[0])?y(t[0],A(Ea())):y(pr(t,1),A(Ea()));var n=t.length;return no(function(r){for(var o=-1,a=Yc(r.length,n);++o<a;)r[o]=t[o].call(this,r[o]);return u(e,this,r)})}),fp=no(function(e,t){var n=$(t,wa(fp));return ca(e,we,oe,t,n)}),pp=no(function(e,t){var n=$(t,wa(pp));return ca(e,Ee,oe,t,n)}),dp=ma(function(e,t){return ca(e,Pe,oe,oe,oe,t)}),hp=ia(br),yp=ia(function(e,t){return e>=t}),vp=xr(function(){return arguments}())?xr:function(e){return as(e)&&vc.call(e,"callee")&&!Tc.call(e,"callee")},mp=nc.isArray,gp=Fn?A(Fn):kr,bp=Wc||Wl,_p=Vn?A(Vn):Sr,wp=Wn?A(Wn):Rr,Ep=Bn?A(Bn):Ir,Op=qn?A(qn):Ar,Pp=Hn?A(Hn):Dr,Cp=ia(Vr),xp=ia(function(e,t){return e<=t}),kp=qo(function(e,t){if(Wa(t)||Yu(t))return void Fo(t,Vs(t),e);for(var n in t)vc.call(t,n)&&zn(e,n,t[n])}),Sp=qo(function(e,t){Fo(t,Ws(t),e)}),Tp=qo(function(e,t,n,r){Fo(t,Ws(t),e,r)}),jp=qo(function(e,t,n,r){Fo(t,Vs(t),e,r)}),Rp=ma(tr),Np=no(function(e){return e.push(oe,fa),u(Tp,oe,e)}),Mp=no(function(e){return e.push(oe,pa),u(Up,oe,e)}),Ip=ea(function(e,t,n){e[t]=n},Sl(jl)),Ap=ea(function(e,t,n){vc.call(e,t)?e[t].push(n):e[t]=[n]},Ea),Dp=no(Cr),Lp=qo(function(e,t,n){Hr(e,t,n)}),Up=qo(function(e,t,n,r){Hr(e,t,n,r)}),Fp=ma(function(e,t){var n={};if(null==e)return n;var r=!1;t=y(t,function(t){return t=Po(t,e),r||(r=t.length>1),t}),Fo(e,ba(e),n),r&&(n=rr(n,fe|pe|de,da));for(var o=t.length;o--;)vo(n,t[o]);return n}),Vp=ma(function(e,t){return null==e?{}:$r(e,t)}),Wp=la(Vs),Bp=la(Ws),qp=$o(function(e,t,n){return t=t.toLowerCase(),e+(n?ol(t):t)}),Hp=$o(function(e,t,n){return e+(n?"-":"")+t.toLowerCase()}),zp=$o(function(e,t,n){return e+(n?" ":"")+t.toLowerCase()}),Yp=Ko("toLowerCase"),Kp=$o(function(e,t,n){return e+(n?"_":"")+t.toLowerCase()}),$p=$o(function(e,t,n){return e+(n?" ":"")+Xp(t)}),Gp=$o(function(e,t,n){return e+(n?" ":"")+t.toUpperCase()}),Xp=Ko("toUpperCase"),Qp=no(function(e,t){try{return u(e,oe,t)}catch(e){return Zu(e)?e:new oc(e)}}),Jp=ma(function(e,t){return l(t,function(t){t=Za(t),er(e,t,ip(e[t],e))}),e}),Zp=Jo(),ed=Jo(!0),td=no(function(e,t){return function(n){return Cr(n,e,t)}}),nd=no(function(e,t){return function(n){return Cr(e,n,t)}}),rd=na(y),od=na(f),ad=na(b),id=aa(),ud=aa(!0),sd=ta(function(e,t){return e+t},0),ld=sa("ceil"),cd=ta(function(e,t){return e/t},1),fd=sa("floor"),pd=ta(function(e,t){return e*t},1),dd=sa("round"),hd=ta(function(e,t){return e-t},0);return n.after=Pu,n.ary=Cu,n.assign=kp,n.assignIn=Sp,n.assignInWith=Tp,n.assignWith=jp,n.at=Rp,n.before=xu,n.bind=ip,n.bindAll=Jp,n.bindKey=up,n.castArray=Fu,n.chain=Xi,n.chunk=ri,n.compact=oi,n.concat=ai,n.cond=xl,n.conforms=kl,n.constant=Sl,n.countBy=Qf,n.create=Ss,n.curry=ku,n.curryRight=Su,n.debounce=Tu,n.defaults=Np,n.defaultsDeep=Mp,n.defer=sp,n.delay=lp,n.difference=Mf,n.differenceBy=If,n.differenceWith=Af,n.drop=ii,n.dropRight=ui,n.dropRightWhile=si,n.dropWhile=li,n.fill=ci,n.filter=uu,n.flatMap=su,n.flatMapDeep=lu,n.flatMapDepth=cu,n.flatten=di,n.flattenDeep=hi,n.flattenDepth=yi,n.flip=ju,n.flow=Zp,n.flowRight=ed,n.fromPairs=vi,n.functions=As,n.functionsIn=Ds,n.groupBy=ep,n.initial=bi,n.intersection=Df,n.intersectionBy=Lf,n.intersectionWith=Uf,n.invert=Ip,n.invertBy=Ap,n.invokeMap=tp,n.iteratee=Rl,n.keyBy=np,n.keys=Vs,n.keysIn=Ws,n.map=hu,n.mapKeys=Bs,n.mapValues=qs,n.matches=Nl,n.matchesProperty=Ml,n.memoize=Ru,n.merge=Lp,n.mergeWith=Up,n.method=td,n.methodOf=nd,n.mixin=Il,n.negate=Nu,n.nthArg=Ll,n.omit=Fp,n.omitBy=Hs,n.once=Mu,n.orderBy=yu,n.over=rd,n.overArgs=cp,n.overEvery=od,n.overSome=ad,n.partial=fp,n.partialRight=pp,n.partition=rp,n.pick=Vp,n.pickBy=zs,n.property=Ul,n.propertyOf=Fl,n.pull=Ff,n.pullAll=Pi,n.pullAllBy=Ci,n.pullAllWith=xi,n.pullAt=Vf,n.range=id,n.rangeRight=ud,n.rearg=dp,n.reject=gu,n.remove=ki,n.rest=Iu,n.reverse=Si,n.sampleSize=_u,n.set=Ks,n.setWith=$s,n.shuffle=wu,n.slice=Ti,n.sortBy=op,n.sortedUniq=Di,n.sortedUniqBy=Li,n.split=yl,n.spread=Au,n.tail=Ui,n.take=Fi,n.takeRight=Vi,n.takeRightWhile=Wi,n.takeWhile=Bi,n.tap=Qi,n.throttle=Du,n.thru=Ji,n.toArray=_s,n.toPairs=Wp,n.toPairsIn=Bp,n.toPath=Yl,n.toPlainObject=Cs,n.transform=Gs,n.unary=Lu,n.union=Wf,n.unionBy=Bf,n.unionWith=qf,n.uniq=qi,n.uniqBy=Hi,n.uniqWith=zi,n.unset=Xs,n.unzip=Yi,n.unzipWith=Ki,n.update=Qs,n.updateWith=Js,n.values=Zs,n.valuesIn=el,n.without=Hf,n.words=Cl,n.wrap=Uu,n.xor=zf,n.xorBy=Yf,n.xorWith=Kf,n.zip=$f,n.zipObject=$i,n.zipObjectDeep=Gi,n.zipWith=Gf,n.entries=Wp,n.entriesIn=Bp,n.extend=Sp,n.extendWith=Tp,Il(n,n),n.add=sd,n.attempt=Qp,n.camelCase=qp,n.capitalize=ol,n.ceil=ld,n.clamp=tl,n.clone=Vu,n.cloneDeep=Bu,n.cloneDeepWith=qu,n.cloneWith=Wu,n.conformsTo=Hu,n.deburr=al,n.defaultTo=Tl,n.divide=cd,n.endsWith=il,n.eq=zu,n.escape=ul,n.escapeRegExp=sl,n.every=iu,n.find=Jf,n.findIndex=fi,n.findKey=Ts,n.findLast=Zf,n.findLastIndex=pi,n.findLastKey=js,n.floor=fd,n.forEach=fu,n.forEachRight=pu,n.forIn=Rs,n.forInRight=Ns,n.forOwn=Ms,n.forOwnRight=Is,n.get=Ls,n.gt=hp,n.gte=yp,n.has=Us,n.hasIn=Fs,n.head=mi,n.identity=jl,n.includes=du,n.indexOf=gi,n.inRange=nl,n.invoke=Dp,n.isArguments=vp,n.isArray=mp,n.isArrayBuffer=gp,n.isArrayLike=Yu,n.isArrayLikeObject=Ku,n.isBoolean=$u,n.isBuffer=bp,n.isDate=_p,n.isElement=Gu,n.isEmpty=Xu,n.isEqual=Qu,n.isEqualWith=Ju,n.isError=Zu,n.isFinite=es,n.isFunction=ts,n.isInteger=ns,n.isLength=rs,n.isMap=wp,n.isMatch=is,n.isMatchWith=us,n.isNaN=ss,n.isNative=ls,n.isNil=fs,n.isNull=cs,n.isNumber=ps,n.isObject=os,n.isObjectLike=as,n.isPlainObject=ds,n.isRegExp=Ep,n.isSafeInteger=hs,n.isSet=Op,n.isString=ys,n.isSymbol=vs,n.isTypedArray=Pp,n.isUndefined=ms,n.isWeakMap=gs,n.isWeakSet=bs,n.join=_i,n.kebabCase=Hp,n.last=wi,n.lastIndexOf=Ei,n.lowerCase=zp,n.lowerFirst=Yp,n.lt=Cp,n.lte=xp,n.max=$l,n.maxBy=Gl,n.mean=Xl,n.meanBy=Ql,n.min=Jl,n.minBy=Zl,n.stubArray=Vl,n.stubFalse=Wl,n.stubObject=Bl,n.stubString=ql,n.stubTrue=Hl,n.multiply=pd,n.nth=Oi,n.noConflict=Al,n.noop=Dl,n.now=ap,n.pad=ll,n.padEnd=cl,n.padStart=fl,n.parseInt=pl,n.random=rl,n.reduce=vu,n.reduceRight=mu,n.repeat=dl,n.replace=hl,n.result=Ys,n.round=dd,n.runInContext=e,n.sample=bu,n.size=Eu,n.snakeCase=Kp,n.some=Ou,n.sortedIndex=ji,n.sortedIndexBy=Ri,n.sortedIndexOf=Ni,n.sortedLastIndex=Mi,n.sortedLastIndexBy=Ii,n.sortedLastIndexOf=Ai,n.startCase=$p,n.startsWith=vl,n.subtract=hd,n.sum=ec,n.sumBy=tc,n.template=ml,n.times=zl,n.toFinite=ws,n.toInteger=Es,n.toLength=Os,n.toLower=gl,n.toNumber=Ps,n.toSafeInteger=xs,n.toString=ks,n.toUpper=bl,n.trim=_l,n.trimEnd=wl,n.trimStart=El,n.truncate=Ol,n.unescape=Pl,n.uniqueId=Kl,n.upperCase=Gp,n.upperFirst=Xp,n.each=fu,n.eachRight=pu,n.first=mi,Il(n,function(){var e={};return dr(n,function(t,r){vc.call(n.prototype,r)||(e[r]=t)}),e}(),{chain:!1}),n.VERSION="4.17.4",l(["bind","bindKey","curry","curryRight","partial","partialRight"],function(e){n[e].placeholder=n}),l(["drop","take"],function(e,t){_.prototype[e]=function(n){n=n===oe?1:zc(Es(n),0);var r=this.__filtered__&&!t?new _(this):this.clone();return r.__filtered__?r.__takeCount__=Yc(n,r.__takeCount__):r.__views__.push({size:Yc(n,De),type:e+(r.__dir__<0?"Right":"")}),r},_.prototype[e+"Right"]=function(t){return this.reverse()[e](t).reverse()}}),l(["filter","map","takeWhile"],function(e,t){var n=t+1,r=n==je||3==n;_.prototype[e]=function(e){var t=this.clone();return t.__iteratees__.push({iteratee:Ea(e,3),type:n}),t.__filtered__=t.__filtered__||r,t}}),l(["head","last"],function(e,t){var n="take"+(t?"Right":"");_.prototype[e]=function(){return this[n](1).value()[0]}}),l(["initial","tail"],function(e,t){var n="drop"+(t?"":"Right");_.prototype[e]=function(){return this.__filtered__?new _(this):this[n](1)}}),_.prototype.compact=function(){return this.filter(jl)},_.prototype.find=function(e){return this.filter(e).head()},_.prototype.findLast=function(e){return this.reverse().find(e)},_.prototype.invokeMap=no(function(e,t){return"function"==typeof e?new _(this):this.map(function(n){return Cr(n,e,t)})}),_.prototype.reject=function(e){return this.filter(Nu(Ea(e)))},_.prototype.slice=function(e,t){e=Es(e);var n=this;return n.__filtered__&&(e>0||t<0)?new _(n):(e<0?n=n.takeRight(-e):e&&(n=n.drop(e)),t!==oe&&(t=Es(t),n=t<0?n.dropRight(-t):n.take(t-e)),n)},_.prototype.takeRightWhile=function(e){return this.reverse().takeWhile(e).reverse()},_.prototype.toArray=function(){return this.take(De)},dr(_.prototype,function(e,t){var r=/^(?:filter|find|map|reject)|While$/.test(t),a=/^(?:head|last)$/.test(t),i=n[a?"take"+("last"==t?"Right":""):t],u=a||/^find/.test(t);i&&(n.prototype[t]=function(){var t=this.__wrapped__,s=a?[1]:arguments,l=t instanceof _,c=s[0],f=l||mp(t),p=function(e){var t=i.apply(n,v([e],s));return a&&d?t[0]:t};f&&r&&"function"==typeof c&&1!=c.length&&(l=f=!1);var d=this.__chain__,h=!!this.__actions__.length,y=u&&!d,m=l&&!h;if(!u&&f){t=m?t:new _(this);var g=e.apply(t,s);return g.__actions__.push({func:Ji,args:[p],thisArg:oe}),new o(g,d)}return y&&m?e.apply(this,s):(g=this.thru(p),y?a?g.value()[0]:g.value():g)})}),l(["pop","push","shift","sort","splice","unshift"],function(e){var t=fc[e],r=/^(?:push|sort|unshift)$/.test(e)?"tap":"thru",o=/^(?:pop|shift)$/.test(e);n.prototype[e]=function(){var e=arguments;if(o&&!this.__chain__){var n=this.value();return t.apply(mp(n)?n:[],e)}return this[r](function(n){return t.apply(mp(n)?n:[],e)})}}),dr(_.prototype,function(e,t){var r=n[t];if(r){var o=r.name+"";(of[o]||(of[o]=[])).push({name:t,func:r})}}),of[Zo(oe,me).name]=[{name:"wrapper",func:oe}],_.prototype.clone=T,_.prototype.reverse=Q,_.prototype.value=te,n.prototype.at=Xf,n.prototype.chain=Zi,n.prototype.commit=eu,n.prototype.next=tu,n.prototype.plant=ru,n.prototype.reverse=ou,n.prototype.toJSON=n.prototype.valueOf=n.prototype.value=au,n.prototype.first=n.prototype.head,Nc&&(n.prototype[Nc]=nu),n}();Mn._=Gn,(o=function(){return Gn}.call(t,n,t,r))!==oe&&(r.exports=o)}).call(this)}).call(t,n(36),n(37)(e))},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(10),o=n(425),a=function(e){return e&&e.__esModule?e:{default:e}}(o),i=function(e){var t=e.songs;return{playback:e.playback,songs:t}},u=function(e){return{}};t.default=(0,r.connect)(i,u)(a.default)},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var u=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),s=n(0),l=r(s),c=n(426),f=r(c),p=n(438),d=r(p),h=n(149),y=function(e){function t(e){o(this,t);var n=a(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.state=n.setMediaPlayerState(e),n}return i(t,e),u(t,[{key:"componentWillReceiveProps",value:function(e){(!this.props.playback.collection||!this.state.playing&&this.state.queueFinished||e.playback.collection&&e.playback.collection.id!==this.props.playback.collection.id)&&this.setState({playingIndex:0},this.setState(this.setMediaPlayerState(e)))}},{key:"setMediaPlayerState",value:function(e){var t=e.songs,n=e.playback,r=null,o=!1,a=0,i=!1,u=void 0;this.state&&void 0!==this.state.playingIndex&&!i&&(a=this.state.playingIndex);var s=n.collection;if(s){var l=s.song_ids;l.length>0&&(t[l[a]]?(u=t[l[a]],r=u.file_path,o=!0,i=!1):i=!0)}return{url:r,playing:o,volume:.8,muted:!1,played:0,loaded:0,duration:0,playbackRate:1,playingIndex:a,queueFinished:i,songBeingPlayed:u,oldVolume:.8}}},{key:"load",value:function(){var e=this;return function(t){e.setState({url:t,played:0,loaded:0})}}},{key:"nextSong",value:function(){var e=this;return function(){var t=e.props,n=t.songs,r=t.playback,o=r.collection;if(o){var a=o.song_ids;e.state.playingIndex+1>=a.length?e.setState({playing:!1,queueFinished:!0,playingIndex:0,played:0,playedSeconds:0,loaded:0,duration:0,url:n[a[0]].file_path}):e.setState({playing:!0,queueFinished:!0,played:0,playedSeconds:0,loaded:0,duration:0,url:n[a[e.state.playingIndex+1]].file_path,playingIndex:e.state.playingIndex+1})}}}},{key:"prevSong",value:function(){var e=this;return function(){var t=e.props,n=(t.songs,t.playback,e.state.playingIndex-1);n>=0&&e.state.duration*e.state.played<3?e.setState(function(e){return{playingIndex:n}},function(){return e.setState(e.setMediaPlayerState(e.props))}):e.player.seekTo(0)}}},{key:"playPause",value:function(){var e=this;return function(){e.setState({playing:!e.state.playing})}}},{key:"stop",value:function(){var e=this;return function(){e.setState({url:null,playing:!1})}}},{key:"setVolume",value:function(){var e=this;return function(t){e.setState({volume:parseFloat(t.target.value)})}}},{key:"toggleMuted",value:function(){var e=this;return function(){var t=0,n=0;e.state.muted?t=e.state.oldVolume:n=e.state.volume,e.setState({muted:!e.state.muted,volume:t,oldVolume:n})}}},{key:"setPlaybackRate",value:function(){var e=this;return function(t){e.setState({playbackRate:parseFloat(t.target.value)})}}},{key:"onPlay",value:function(){var e=this;return function(){e.setState({playing:!0})}}},{key:"onPause",value:function(){var e=this;return function(){e.setState({playing:!1})}}},{key:"onSeekMouseDown",value:function(){var e=this;return function(t){e.setState({seeking:!0})}}},{key:"onSeekChange",value:function(){var e=this;return function(t){e.setState({played:parseFloat(t.target.value)})}}},{key:"onSeekMouseUp",value:function(){var e=this;return function(t){e.setState({seeking:!1}),e.player.seekTo(parseFloat(t.target.value))}}},{key:"onProgress",value:function(){var e=this;return function(t){e.state.seeking||e.setState(t)}}},{key:"ref",value:function(){var e=this;return function(t){e.player=t}}},{key:"render",value:function(){var e=this,t=this.state,n=t.url,r=t.playing,o=t.volume,a=t.muted,i=t.played,u=(t.loaded,t.duration),s=t.playbackRate,c={},p={},y=void 0;return y=a?l.default.createElement("i",{className:"fa fa-volume-off green-elem"}):o<.5?l.default.createElement("i",{className:"fa fa-volume-down"}):l.default.createElement("i",{className:"fa fa-volume-up"}),this.props.playback.collection&&this.props.songs&&(c=this.props.playback.collection,p=this.props.songs[c.song_ids[this.state.playingIndex]]),l.default.createElement("div",{className:"media-player-container"},l.default.createElement("div",{className:"player-wrapper"},l.default.createElement(f.default,{ref:this.ref(),className:"react-player",width:"100%",height:"100%",url:n,playing:r,playbackRate:s,volume:o,muted:a,onPlay:this.onPlay(),onPause:this.onPause(),onEnded:this.nextSong(),onError:function(e){return console.log("onError",e)},onProgress:this.onProgress(),onDuration:function(t){return e.setState({duration:t})}})),l.default.createElement("div",{className:"hbox media-player-flex-container"},l.default.createElement("div",{className:"hbox current-song-display-flex-container"},l.default.createElement(d.default,{collection:c,song:p})),l.default.createElement("div",{className:"vbox media-player-control-flex-container"},l.default.createElement("div",{className:"hbox media-player-playback-controls"},l.default.createElement("div",{className:"media-player-control"},l.default.createElement("i",{onClick:this.prevSong(),className:"fa fa-step-backward fa-2x strong"})),l.default.createElement("div",{className:"media-player-control",onClick:this.playPause()},r?l.default.createElement("i",{className:"fa fa-pause fa-2x strong"}):l.default.createElement("i",{className:"fa fa-play fa-2x strong"})),l.default.createElement("div",{className:"media-player-control"},l.default.createElement("i",{onClick:this.nextSong(),className:"fa fa-step-forward fa-2x strong"}))),l.default.createElement("div",{className:"hbox media-player-progress"},(0,h.formatSeconds)(u*i),l.default.createElement("progress",{max:1,value:i}),(0,h.formatSeconds)(u),!1)),l.default.createElement("div",{className:"hbox volume-media-flex-container"},l.default.createElement("div",{className:"volume-media-icon",onClick:this.toggleMuted()},y),l.default.createElement("input",{className:"volume-media-icon",type:"range",min:0,max:1,step:"any",value:o,onChange:this.setVolume()}))))}}]),t}(l.default.Component);t.default=y},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var u=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},s=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),l=n(0),c=r(l),f=n(90),p=n(16),d=n(429),h=r(d),y=n(430),v=r(y),m=n(431),g=r(m),b=n(432),_=r(b),w=n(168),E=r(w),O=n(433),P=r(O),C=n(434),x=r(C),k=n(435),S=r(k),T=n(436),j=r(T),R=n(437),N=r(R),M=Object.keys(f.propTypes),I=[h.default,v.default,g.default,_.default,P.default,x.default,S.default,N.default,j.default],A=function(e){function t(){var e,n,r,i;o(this,t);for(var s=arguments.length,l=Array(s),d=0;d<s;d++)l[d]=arguments[d];return n=r=a(this,(e=t.__proto__||Object.getPrototypeOf(t)).call.apply(e,[this].concat(l))),r.config=(0,p.getConfig)(r.props,f.defaultProps,!0),r.seekTo=function(e){if(!r.player)return null;r.player.seekTo(e)},r.getDuration=function(){return r.player?r.player.getDuration():null},r.getCurrentTime=function(){return r.player?r.player.getCurrentTime():null},r.getInternalPlayer=function(){return r.player?r.player.player:null},r.progress=function(){if(r.props.url&&r.player&&r.player.isReady){var e=r.player.getCurrentTime()||0,t=r.player.getSecondsLoaded(),n=r.player.getDuration();if(n){var o={playedSeconds:e,played:e/n};null!==t&&(o.loadedSeconds=t,o.loaded=t/n),o.played===r.prevPlayed&&o.loaded===r.prevLoaded||r.props.onProgress(o),r.prevPlayed=o.played,r.prevLoaded=o.loaded}}r.progressTimeout=setTimeout(r.progress,r.props.progressFrequency)},r.renderPlayer=function(e){return c.default.createElement(e,u({},r.props,{ref:r.activePlayerRef,key:e.displayName,config:r.config}))},r.activePlayerRef=function(e){r.player=e},r.wrapperRef=function(e){r.wrapper=e},r.renderPreloadPlayer=function(e){return c.default.createElement(e,{key:e.displayName,config:r.config})},i=n,a(r,i)}return i(t,e),s(t,[{key:"componentDidMount",value:function(){this.progress()}},{key:"componentWillUnmount",value:function(){clearTimeout(this.progressTimeout)}},{key:"shouldComponentUpdate",value:function(e){return this.props.url!==e.url||this.props.playing!==e.playing||this.props.volume!==e.volume||this.props.muted!==e.muted||this.props.playbackRate!==e.playbackRate||this.props.height!==e.height||this.props.width!==e.width||this.props.hidden!==e.hidden}},{key:"renderActivePlayer",value:function(e){if(!e)return null;var t=!0,n=!1,r=void 0;try{for(var o,a=I[Symbol.iterator]();!(t=(o=a.next()).done);t=!0){var i=o.value;if(i.canPlay(e))return this.renderPlayer(i)}}catch(e){n=!0,r=e}finally{try{!t&&a.return&&a.return()}finally{if(n)throw r}}return this.renderPlayer(E.default)}},{key:"renderPreloadPlayers",value:function(e){var t=[];return!h.default.canPlay(e)&&this.config.youtube.preload&&t.push(h.default),!g.default.canPlay(e)&&this.config.vimeo.preload&&t.push(g.default),!j.default.canPlay(e)&&this.config.dailymotion.preload&&t.push(j.default),t.map(this.renderPreloadPlayer)}},{key:"render",value:function(){var e=this.props,t=e.url,n=e.style,r=e.width,o=e.height,a=(0,p.omit)(this.props,M,f.DEPRECATED_CONFIG_PROPS),i=this.renderActivePlayer(t),s=this.renderPreloadPlayers(t);return c.default.createElement("div",u({ref:this.wrapperRef,style:u({},n,{width:r,height:o})},a),i,s)}}]),t}(l.Component);A.displayName="ReactPlayer",A.propTypes=f.propTypes,A.defaultProps=f.defaultProps,A.canPlay=function(e){var t=[].concat(I,[E.default]),n=!0,r=!1,o=void 0;try{for(var a,i=t[Symbol.iterator]();!(n=(a=i.next()).done);n=!0){if(a.value.canPlay(e))return!0}}catch(e){r=!0,o=e}finally{try{!n&&i.return&&i.return()}finally{if(r)throw o}}return!1},t.default=A},function(e,t){function n(e,t){for(var n in t)e.setAttribute(n,t[n])}function r(e,t){e.onload=function(){this.onerror=this.onload=null,t(null,e)},e.onerror=function(){this.onerror=this.onload=null,t(new Error("Failed to load "+this.src),e)}}function o(e,t){e.onreadystatechange=function(){"complete"!=this.readyState&&"loaded"!=this.readyState||(this.onreadystatechange=null,t(null,e))}}e.exports=function(e,t,a){var i=document.head||document.getElementsByTagName("head")[0],u=document.createElement("script");"function"==typeof t&&(a=t,t={}),t=t||{},a=a||function(){},u.type=t.type||"text/javascript",u.charset=t.charset||"utf8",u.async=!("async"in t)||!!t.async,u.src=e,t.attrs&&n(u,t.attrs),t.text&&(u.text=""+t.text),("onload"in u?r:o)(u,a),u.onload||r(u,a),i.appendChild(u)}},function(e,t,n){"use strict";function r(e){return!!e&&"object"==typeof e}function o(e){var t=Object.prototype.toString.call(e);return"[object RegExp]"===t||"[object Date]"===t||a(e)}function a(e){return e.$$typeof===d}function i(e){return Array.isArray(e)?[]:{}}function u(e,t){return t&&!0===t.clone&&f(e)?c(i(e),e,t):e}function s(e,t,n){var r=e.slice();return t.forEach(function(t,o){void 0===r[o]?r[o]=u(t,n):f(t)?r[o]=c(e[o],t,n):-1===e.indexOf(t)&&r.push(u(t,n))}),r}function l(e,t,n){var r={};return f(e)&&Object.keys(e).forEach(function(t){r[t]=u(e[t],n)}),Object.keys(t).forEach(function(o){f(t[o])&&e[o]?r[o]=c(e[o],t[o],n):r[o]=u(t[o],n)}),r}function c(e,t,n){var r=Array.isArray(t),o=Array.isArray(e),a=n||{arrayMerge:s};if(r===o)return r?(a.arrayMerge||s)(e,t,n):l(e,t,n);return u(t,n)}var f=function(e){return r(e)&&!o(e)},p="function"==typeof Symbol&&Symbol.for,d=p?Symbol.for("react.element"):60103;c.all=function(e,t){if(!Array.isArray(e)||e.length<2)throw new Error("first argument should be an array with at least two elements");return e.reduce(function(e,n){return c(e,n,t)})};var h=c;e.exports=h},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var u=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},s=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),l=function e(t,n,r){null===t&&(t=Function.prototype);var o=Object.getOwnPropertyDescriptor(t,n);if(void 0===o){var a=Object.getPrototypeOf(t);return null===a?void 0:e(a,n,r)}if("value"in o)return o.value;var i=o.get;if(void 0!==i)return i.call(r)},c=n(0),f=r(c),p=n(19),d=r(p),h=n(16),y="YT",v=/^(?:https?:\/\/)?(?:www\.|m\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/,m=function(e){function t(){var e,n,r,i;o(this,t);for(var u=arguments.length,s=Array(u),l=0;l<u;l++)s[l]=arguments[l];return n=r=a(this,(e=t.__proto__||Object.getPrototypeOf(t)).call.apply(e,[this].concat(s))),r.onStateChange=function(e){var t=e.data,n=r.props,o=n.onPause,a=n.onBuffer,i=window[y].PlayerState,u=i.PLAYING,s=i.PAUSED,l=i.BUFFERING,c=i.ENDED,f=i.CUED;t===u&&r.onPlay(),t===s&&o(),t===l&&a(),t===c&&r.onEnded(),t===f&&r.onReady()},r.onEnded=function(){var e=r.props,t=e.loop,n=e.onEnded;t&&r.seekTo(0),n()},r.ref=function(e){r.container=e},i=n,a(r,i)}return i(t,e),s(t,[{key:"componentDidMount",value:function(){var e=this.props,n=e.url,r=e.config;!n&&r.youtube.preload&&(this.preloading=!0,this.load("https://www.youtube.com/watch?v=GlCmAC4MHek")),l(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"componentDidMount",this).call(this)}},{key:"load",value:function(e){var t=this,n=this.props,r=n.playsinline,o=n.controls,a=n.config,i=n.onError,s=e&&e.match(v)[1];return this.isReady?void this.player.cueVideoById({videoId:s,startSeconds:(0,h.parseStartTime)(e)}):this.loadingSDK?void(this.loadOnReady=e):(this.loadingSDK=!0,void(0,h.getSDK)("https://www.youtube.com/iframe_api",y,"onYouTubeIframeAPIReady",function(e){return e.loaded}).then(function(n){t.player=new n.Player(t.container,{width:"100%",height:"100%",videoId:s,playerVars:u({controls:o?1:0,start:(0,h.parseStartTime)(e),origin:window.location.origin,playsinline:r},a.youtube.playerVars),events:{onReady:t.onReady,onStateChange:t.onStateChange,onError:function(e){return i(e.data)}}})},i))}},{key:"play",value:function(){this.callPlayer("playVideo")}},{key:"pause",value:function(){this.callPlayer("pauseVideo")}},{key:"stop",value:function(){this.preloading||document.body.contains(this.callPlayer("getIframe"))&&this.callPlayer("stopVideo")}},{key:"seekTo",value:function(e){var n=l(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"seekTo",this).call(this,e);this.callPlayer("seekTo",n)}},{key:"setVolume",value:function(e){this.callPlayer("setVolume",100*e)}},{key:"setPlaybackRate",value:function(e){this.callPlayer("setPlaybackRate",e)}},{key:"getDuration",value:function(){return this.callPlayer("getDuration")}},{key:"getCurrentTime",value:function(){return this.callPlayer("getCurrentTime")}},{key:"getSecondsLoaded",value:function(){return this.callPlayer("getVideoLoadedFraction")*this.getDuration()}},{key:"render",value:function(){var e={width:"100%",height:"100%",display:this.props.url?"block":"none"};return f.default.createElement("div",{style:e},f.default.createElement("div",{ref:this.ref}))}}],[{key:"canPlay",value:function(e){return v.test(e)}}]),t}(d.default);m.displayName="YouTube",t.default=m},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var u=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},s=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),l=function e(t,n,r){null===t&&(t=Function.prototype);var o=Object.getOwnPropertyDescriptor(t,n);if(void 0===o){var a=Object.getPrototypeOf(t);return null===a?void 0:e(a,n,r)}if("value"in o)return o.value;var i=o.get;if(void 0!==i)return i.call(r)},c=n(0),f=r(c),p=n(19),d=r(p),h=n(16),y=/^https?:\/\/(soundcloud.com|snd.sc)\/([a-z0-9-_]+\/[a-z0-9-_]+)$/,v={visual:!0,buying:!1,liking:!1,download:!1,sharing:!1,show_comments:!1,show_playcount:!1},m=function(e){function t(){var e,n,r,i;o(this,t);for(var u=arguments.length,s=Array(u),l=0;l<u;l++)s[l]=arguments[l];return n=r=a(this,(e=t.__proto__||Object.getPrototypeOf(t)).call.apply(e,[this].concat(s))),r.duration=null,r.currentTime=null,r.fractionLoaded=null,r.ref=function(e){r.iframe=e},i=n,a(r,i)}return i(t,e),s(t,[{key:"load",value:function(e){var t=this;(0,h.getSDK)("https://w.soundcloud.com/player/api.js","SC").then(function(n){var r=n.Widget.Events,o=r.PLAY,a=r.PLAY_PROGRESS,i=r.PAUSE,s=r.FINISH,l=r.ERROR;t.isReady||(t.player=n.Widget(t.iframe),t.player.bind(o,function(){t.widgetIsPlaying=!0,t.onPlay()}),t.player.bind(i,function(){t.widgetIsPlaying=!1,t.props.onPause()}),t.player.bind(a,function(e){t.currentTime=e.currentPosition/1e3,t.fractionLoaded=e.loadedProgress}),t.player.bind(s,function(){return t.props.onEnded()}),t.player.bind(l,function(e){return t.props.onError(e)})),t.player.load(e,u({},v,t.props.config.soundcloud.options,{callback:function(){t.widgetIsPlaying=!1,t.player.getDuration(function(e){t.duration=e/1e3,t.onReady()})}}))})}},{key:"play",value:function(){this.widgetIsPlaying||this.callPlayer("play")}},{key:"pause",value:function(){this.widgetIsPlaying&&this.callPlayer("pause")}},{key:"stop",value:function(){}},{key:"seekTo",value:function(e){var n=l(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"seekTo",this).call(this,e);this.callPlayer("seekTo",1e3*n)}},{key:"setVolume",value:function(e){this.callPlayer("setVolume",100*e)}},{key:"getDuration",value:function(){return this.duration}},{key:"getCurrentTime",value:function(){return this.currentTime}},{key:"getSecondsLoaded",value:function(){return this.fractionLoaded*this.duration}},{key:"render",value:function(){var e={width:"100%",height:"100%"};return f.default.createElement("iframe",{ref:this.ref,src:"https://w.soundcloud.com/player/?url="+encodeURIComponent(this.props.url),style:e,frameBorder:0})}}],[{key:"canPlay",value:function(e){return y.test(e)}}]),t}(d.default);m.displayName="SoundCloud",t.default=m},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var u=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},s=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),l=function e(t,n,r){null===t&&(t=Function.prototype);var o=Object.getOwnPropertyDescriptor(t,n);if(void 0===o){var a=Object.getPrototypeOf(t);return null===a?void 0:e(a,n,r)}if("value"in o)return o.value;var i=o.get;if(void 0!==i)return i.call(r)},c=n(0),f=r(c),p=n(19),d=r(p),h=n(16),y=/https?:\/\/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/,v=function(e){function t(){var e,n,r,i;o(this,t);for(var u=arguments.length,s=Array(u),l=0;l<u;l++)s[l]=arguments[l];return n=r=a(this,(e=t.__proto__||Object.getPrototypeOf(t)).call.apply(e,[this].concat(s))),r.ref=function(e){r.container=e},i=n,a(r,i)}return i(t,e),s(t,[{key:"componentDidMount",value:function(){var e=this.props,n=e.url,r=e.config;!n&&r.vimeo.preload&&(this.preloading=!0,this.load("https://vimeo.com/127250231")),l(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"componentDidMount",this).call(this)}},{key:"load",value:function(e){var t=this,n=e.match(y)[3];return this.duration=null,this.isReady?void this.player.loadVideo(n):this.loadingSDK?void(this.loadOnReady=e):(this.loadingSDK=!0,void(0,h.getSDK)("https://player.vimeo.com/api/player.js","Vimeo").then(function(n){t.player=new n.Player(t.container,u({},t.props.config.vimeo.playerOptions,{url:e,loop:t.props.loop})),t.player.on("loaded",function(){t.onReady();var e=t.container.querySelector("iframe");e.style.width="100%",e.style.height="100%"}),t.player.on("play",function(e){var n=e.duration;t.duration=n,t.onPlay()}),t.player.on("pause",t.props.onPause),t.player.on("seeked",function(e){return t.props.onSeek(e.seconds)}),t.player.on("ended",t.props.onEnded),t.player.on("error",t.props.onError),t.player.on("timeupdate",function(e){var n=e.seconds;t.currentTime=n}),t.player.on("progress",function(e){var n=e.seconds;t.secondsLoaded=n})},this.props.onError))}},{key:"play",value:function(){this.callPlayer("play")}},{key:"pause",value:function(){this.callPlayer("pause")}},{key:"stop",value:function(){this.preloading||this.callPlayer("unload")}},{key:"seekTo",value:function(e){var n=l(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"seekTo",this).call(this,e);this.callPlayer("setCurrentTime",n)}},{key:"setVolume",value:function(e){this.callPlayer("setVolume",e)}},{key:"getDuration",value:function(){return this.duration}},{key:"getCurrentTime",value:function(){return this.currentTime}},{key:"getSecondsLoaded",value:function(){return this.secondsLoaded}},{key:"render",value:function(){var e={height:"100%",display:this.props.url?"block":"none"};return f.default.createElement("div",{style:e,ref:this.ref})}}],[{key:"canPlay",value:function(e){return y.test(e)}}]),t}(d.default);v.displayName="Vimeo",t.default=v},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var u=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),s=function e(t,n,r){null===t&&(t=Function.prototype);var o=Object.getOwnPropertyDescriptor(t,n);if(void 0===o){var a=Object.getPrototypeOf(t);return null===a?void 0:e(a,n,r)}if("value"in o)return o.value;var i=o.get;if(void 0!==i)return i.call(r)},l=n(0),c=r(l),f=n(19),p=r(f),d=n(16),h="//connect.facebook.net/en_US/sdk.js",y=/^https:\/\/www\.facebook\.com\/([^\/?].+\/)?video(s|\.php)[\/?].*$/,v="facebook-player-",m=function(e){function t(){var e,n,r,i;o(this,t);for(var u=arguments.length,s=Array(u),l=0;l<u;l++)s[l]=arguments[l];return n=r=a(this,(e=t.__proto__||Object.getPrototypeOf(t)).call.apply(e,[this].concat(s))),r.playerID=v+(0,d.randomString)(),r.onEnded=function(){var e=r.props,t=e.loop,n=e.onEnded;t&&r.seekTo(0),n()},i=n,a(r,i)}return i(t,e),u(t,[{key:"load",value:function(e){var t=this;if(this.isReady)return void(0,d.getSDK)(h,"FB","fbAsyncInit").then(function(e){return e.XFBML.parse()});(0,d.getSDK)(h,"FB","fbAsyncInit").then(function(e){e.init({appId:t.props.config.facebook.appId,xfbml:!0,version:"v2.5"}),e.Event.subscribe("xfbml.ready",function(e){"video"===e.type&&e.id===t.playerID&&(t.player=e.instance,t.player.subscribe("startedPlaying",t.onPlay),t.player.subscribe("paused",t.props.onPause),t.player.subscribe("finishedPlaying",t.onEnded),t.player.subscribe("startedBuffering",t.props.onBuffer),t.player.subscribe("error",t.props.onError),t.onReady())})})}},{key:"play",value:function(){this.callPlayer("play")}},{key:"pause",value:function(){this.callPlayer("pause")}},{key:"stop",value:function(){}},{key:"seekTo",value:function(e){var n=s(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"seekTo",this).call(this,e);this.player.seek(n)}},{key:"setVolume",value:function(e){0!==e&&this.callPlayer("unmute"),this.player.setVolume(e)}},{key:"getDuration",value:function(){return this.callPlayer("getDuration")}},{key:"getCurrentTime",value:function(){return this.callPlayer("getCurrentPosition")}},{key:"getSecondsLoaded",value:function(){return null}},{key:"render",value:function(){var e={width:"100%",height:"100%",backgroundColor:"black"};return c.default.createElement("div",{style:e,id:this.playerID,className:"fb-video","data-href":this.props.url,"data-allowfullscreen":"true","data-controls":this.props.controls?void 0:"false"})}}],[{key:"canPlay",value:function(e){return y.test(e)}}]),t}(p.default);m.displayName="Facebook",t.default=m},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var u=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),s=function e(t,n,r){null===t&&(t=Function.prototype);var o=Object.getOwnPropertyDescriptor(t,n);if(void 0===o){var a=Object.getPrototypeOf(t);return null===a?void 0:e(a,n,r)}if("value"in o)return o.value;var i=o.get;if(void 0!==i)return i.call(r)},l=n(0),c=r(l),f=n(19),p=r(f),d=n(16),h=/^https?:\/\/streamable.com\/([a-z0-9]+)$/,y=function(e){function t(){var e,n,r,i;o(this,t);for(var u=arguments.length,s=Array(u),l=0;l<u;l++)s[l]=arguments[l];return n=r=a(this,(e=t.__proto__||Object.getPrototypeOf(t)).call.apply(e,[this].concat(s))),r.duration=null,r.currentTime=null,r.secondsLoaded=null,r.ref=function(e){r.iframe=e},i=n,a(r,i)}return i(t,e),u(t,[{key:"load",value:function(e){var t=this;if(this.loadingSDK)return void(this.loadOnReady=e);this.loadingSDK=!0,(0,d.getSDK)("//cdn.embed.ly/player-0.0.12.min.js","playerjs").then(function(e){t.player=new e.Player(t.iframe),t.player.on("ready",t.onReady),t.player.on("play",t.onPlay),t.player.on("pause",t.props.onPause),t.player.on("seeked",t.props.onSeek),t.player.on("ended",t.props.onEnded),t.player.on("error",t.props.onError),t.player.on("timeupdate",function(e){var n=e.duration,r=e.seconds;t.duration=n,t.currentTime=r}),t.player.on("progress",function(e){var n=e.percent;t.duration&&(t.secondsLoaded=t.duration*n)})},this.props.onError)}},{key:"play",value:function(){this.callPlayer("play")}},{key:"pause",value:function(){this.callPlayer("pause")}},{key:"stop",value:function(){}},{key:"seekTo",value:function(e){var n=s(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"seekTo",this).call(this,e);this.callPlayer("setCurrentTime",n)}},{key:"setVolume",value:function(e){this.callPlayer("setVolume",100*e)}},{key:"getDuration",value:function(){return this.duration}},{key:"getCurrentTime",value:function(){return this.currentTime}},{key:"getSecondsLoaded",value:function(){return this.secondsLoaded}},{key:"render",value:function(){var e=this.props.url.match(h)[1],t={width:"100%",height:"100%"};return c.default.createElement("iframe",{ref:this.ref,src:"https://streamable.com/o/"+e,frameBorder:"0",scrolling:"no",style:t,allowFullScreen:!0})}}],[{key:"canPlay",value:function(e){return h.test(e)}}]),t}(p.default);y.displayName="Streamable",t.default=y},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),u=n(168),s=function(e){return e&&e.__esModule?e:{default:e}}(u),l=/^https?:\/\/vid.me\/([a-z0-9]+)$/i,c={},f=function(e){function t(){return r(this,t),o(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return a(t,e),i(t,[{key:"getData",value:function(e){var t=this.props.onError,n=e.match(l)[1];return c[n]?Promise.resolve(c[n]):window.fetch("https://api.vid.me/videoByUrl/"+n).then(function(e){if(200===e.status)return c[n]=e.json(),c[n];t(new Error("Vidme track could not be resolved"))})}},{key:"getURL",value:function(e){var t=e.video,n=this.props.config;if(n.vidme.format&&t.formats&&0!==t.formats.length){var r=t.formats.findIndex(function(e){return e.type===n.vidme.format});if(-1!==r)return t.formats[r].uri;console.warn('Vidme format "'+n.vidme.format+'" was not found for '+t.full_url)}return t.complete_url}},{key:"load",value:function(e){var t=this,n=this.props.onError;this.stop(),this.getData(e).then(function(e){t.mounted&&(t.player.src=t.getURL(e))},n)}}],[{key:"canPlay",value:function(e){return l.test(e)}}]),t}(s.default);f.displayName="Vidme",t.default=f},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var u=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},s=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),l=function e(t,n,r){null===t&&(t=Function.prototype);var o=Object.getOwnPropertyDescriptor(t,n);if(void 0===o){var a=Object.getPrototypeOf(t);return null===a?void 0:e(a,n,r)}if("value"in o)return o.value;var i=o.get;if(void 0!==i)return i.call(r)},c=n(0),f=r(c),p=n(19),d=r(p),h=n(16),y=/^https?:\/\/(.+)?(wistia.com|wi.st)\/(medias|embed)\/(.*)$/,v=function(e){function t(){return o(this,t),a(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return i(t,e),s(t,[{key:"getID",value:function(e){return e&&e.match(y)[4]}},{key:"load",value:function(e){var t=this,n=this.props,r=n.controls,o=n.onStart,a=n.onPause,i=n.onSeek,s=n.onEnded,l=n.config;this.loadingSDK=!0,(0,h.getSDK)("//fast.wistia.com/assets/external/E-v1.js","Wistia").then(function(){window._wq=window._wq||[],window._wq.push({id:t.getID(e),options:u({controlsVisibleOnLoad:r},l.wistia.options),onReady:function(e){t.player=e,t.player.bind("start",o),t.player.bind("play",t.onPlay),t.player.bind("pause",a),t.player.bind("seek",i),t.player.bind("end",s),t.onReady()}})})}},{key:"play",value:function(){this.callPlayer("play")}},{key:"pause",value:function(){this.callPlayer("pause")}},{key:"stop",value:function(){this.callPlayer("remove")}},{key:"seekTo",value:function(e){var n=l(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"seekTo",this).call(this,e);this.callPlayer("time",n)}},{key:"setVolume",value:function(e){this.callPlayer("volume",e)}},{key:"setPlaybackRate",value:function(e){this.callPlayer("playbackRate",e)}},{key:"getDuration",value:function(){return this.callPlayer("duration")}},{key:"getCurrentTime",value:function(){return this.callPlayer("time")}},{key:"getSecondsLoaded",value:function(){return null}},{key:"render",value:function(){var e=this.getID(this.props.url),t="wistia_embed wistia_async_"+e,n={width:"100%",height:"100%",display:this.props.url?"block":"none"};return f.default.createElement("div",{key:e,className:t,style:n})}}],[{key:"canPlay",value:function(e){return y.test(e)}}]),t}(d.default);v.displayName="Wistia",t.default=v},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var u=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},s=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),l=function e(t,n,r){null===t&&(t=Function.prototype);var o=Object.getOwnPropertyDescriptor(t,n);if(void 0===o){var a=Object.getPrototypeOf(t);return null===a?void 0:e(a,n,r)}if("value"in o)return o.value;var i=o.get;if(void 0!==i)return i.call(r)},c=n(0),f=r(c),p=n(19),d=r(p),h=n(16),y=/^.+dailymotion.com\/(video|hub)\/([^_]+)[^#]*(#video=([^_&]+))?/,v=function(e){function t(){var e,n,r,i;o(this,t);for(var u=arguments.length,s=Array(u),l=0;l<u;l++)s[l]=arguments[l];return n=r=a(this,(e=t.__proto__||Object.getPrototypeOf(t)).call.apply(e,[this].concat(s))),r.onDurationChange=function(e){(0,r.props.onDuration)(r.getDuration())},r.onEnded=function(){var e=r.props,t=e.loop,n=e.onEnded;t&&r.seekTo(0),n()},r.ref=function(e){r.container=e},i=n,a(r,i)}return i(t,e),s(t,[{key:"componentDidMount",value:function(){var e=this.props,n=e.url,r=e.config;!n&&r.dailymotion.preload&&(this.preloading=!0,this.load("http://www.dailymotion.com/video/x522udb")),l(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"componentDidMount",this).call(this)}},{key:"parseId",value:function(e){var t=e.match(y);return t[4]||t[2]}},{key:"load",value:function(e){var t=this,n=this.props,r=n.controls,o=n.config,a=n.onError,i=n.playing,s=this.parseId(e);return this.player?void this.player.load(s,{start:(0,h.parseStartTime)(e),autoplay:i}):this.loadingSDK?void(this.loadOnReady=e):(this.loadingSDK=!0,void(0,h.getSDK)("https://api.dmcdn.net/all.js","DM","dmAsyncInit",function(e){return e.player}).then(function(n){var i=n.player;t.player=new i(t.container,{width:"100%",height:"100%",video:s,params:u({controls:r,autoplay:t.props.playing,start:(0,h.parseStartTime)(e),origin:window.location.origin},o.dailymotion.params),events:{apiready:function(){t.loadingSDK=!1,t.onReady()},seeked:function(){return t.props.onSeek(t.player.currentTime)},video_end:t.onEnded,durationchange:t.onDurationChange,pause:t.props.onPause,playing:t.onPlay,waiting:t.props.onBuffer,error:function(e){return a(e)}}})},a))}},{key:"play",value:function(){this.callPlayer("play")}},{key:"pause",value:function(){this.callPlayer("pause")}},{key:"stop",value:function(){}},{key:"seekTo",value:function(e){var n=l(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"seekTo",this).call(this,e);this.callPlayer("seek",n)}},{key:"setVolume",value:function(e){this.callPlayer("setVolume",e)}},{key:"getDuration",value:function(){return this.isReady?this.player.duration||null:null}},{key:"getCurrentTime",value:function(){return this.player.currentTime}},{key:"getSecondsLoaded",value:function(){return this.player.bufferedTime}},{key:"render",value:function(){var e={width:"100%",height:"100%",backgroundColor:"black",display:this.props.url?"block":"none"};return f.default.createElement("div",{style:e},f.default.createElement("div",{ref:this.ref}))}}],[{key:"canPlay",value:function(e){return y.test(e)}}]),t}(d.default);v.displayName="DailyMotion",t.default=v},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var u=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),s=function e(t,n,r){null===t&&(t=Function.prototype);var o=Object.getOwnPropertyDescriptor(t,n);if(void 0===o){var a=Object.getPrototypeOf(t);return null===a?void 0:e(a,n,r)}if("value"in o)return o.value;var i=o.get;if(void 0!==i)return i.call(r)},l=n(0),c=r(l),f=n(19),p=r(f),d=n(16),h=/^(?:https?:\/\/)?(?:www\.)twitch\.tv\/videos\/(\d+)($|\?)/,y=/^(?:https?:\/\/)?(?:www\.)twitch\.tv\/([a-z0-9_]+)($|\?)/,v="twitch-player-",m=function(e){function t(){var e,n,r,i;o(this,t);for(var u=arguments.length,s=Array(u),l=0;l<u;l++)s[l]=arguments[l];return n=r=a(this,(e=t.__proto__||Object.getPrototypeOf(t)).call.apply(e,[this].concat(s))),r.playerID=v+(0,d.randomString)(),r.onEnded=function(){var e=r.props,t=e.loop,n=e.onEnded;t&&r.seekTo(0),n()},i=n,a(r,i)}return i(t,e),u(t,[{key:"load",value:function(e){var t=this,n=this.props,r=n.playsinline,o=n.onError,a=y.test(e),i=a?e.match(y)[1]:e.match(h)[1];return this.isReady?void(a?this.player.setChannel(i):this.player.setVideo("v"+i)):this.loadingSDK?void(this.loadOnReady=e):(this.loadingSDK=!0,void(0,d.getSDK)("//player.twitch.tv/js/embed/v1.js","Twitch").then(function(e){t.player=new e.Player(t.playerID,{video:a?"":i,channel:a?i:"",height:"100%",width:"100%",playsinline:r});var n=e.Player,o=n.READY,u=n.PLAY,s=n.PAUSE,l=n.ENDED;t.player.addEventListener(o,t.onReady),t.player.addEventListener(u,t.onPlay),t.player.addEventListener(s,t.props.onPause),t.player.addEventListener(l,t.onEnded)},o))}},{key:"play",value:function(){this.callPlayer("play")}},{key:"pause",value:function(){this.callPlayer("pause")}},{key:"stop",value:function(){this.callPlayer("pause")}},{key:"seekTo",value:function(e){var n=s(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"seekTo",this).call(this,e);this.callPlayer("seek",n)}},{key:"setVolume",value:function(e){this.callPlayer("setVolume",e)}},{key:"getDuration",value:function(){return this.callPlayer("getDuration")}},{key:"getCurrentTime",value:function(){return this.callPlayer("getCurrentTime")}},{key:"getSecondsLoaded",value:function(){return null}},{key:"render",value:function(){var e={width:"100%",height:"100%"};return c.default.createElement("div",{style:e,id:this.playerID})}}],[{key:"canPlay",value:function(e){return h.test(e)||y.test(e)}}]),t}(p.default);m.displayName="Twitch",t.default=m},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(10),o=n(439),a=function(e){return e&&e.__esModule?e:{default:e}}(o),i=function(e,t){return{song:t.song,collection:t.collection}};t.default=(0,r.connect)(i,void 0)(a.default)},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),u=n(0),s=function(e){return e&&e.__esModule?e:{default:e}}(u),l=(n(8),function(e){function t(){return r(this,t),o(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return a(t,e),i(t,[{key:"handleReproduceCollection",value:function(e){e.preventDefault(),this.props.reproduceCollection(this.props.collection)}},{key:"render",value:function(){var e=this.props,t=e.song,n=e.collection,r=t.image_url||"",o=t.title||"",a=t.artist_name||"";return n&&n.id&&n.author_id&&"/user/"+n.author_id+"/playlist/"+n.id,s.default.createElement("div",{className:"hbox thumb-info-flex-container"},s.default.createElement("div",{className:"vbox thumb-info-image-container"},!!r&&s.default.createElement("img",{src:r})),s.default.createElement("div",{className:"vbox thumb-song-details"},s.default.createElement("div",{className:"thumb-song-name"},o),s.default.createElement("div",{className:"thumb-song-band"},a)))}}]),t}(s.default.Component));t.default=l},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var o=n(47),a=n(441),i=r(a),u=n(442),s=(r(u),n(443)),l=r(s),c=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return(0,o.createStore)(l.default,e,(0,o.applyMiddleware)(i.default))};t.default=c},function(e,t,n){"use strict";function r(e){return function(t){var n=t.dispatch,r=t.getState;return function(t){return function(o){return"function"==typeof o?o(n,r,e):t(o)}}}}t.__esModule=!0;var o=r();o.withExtraArgument=r,t.default=o},function(e,t,n){(function(e){!function(e,n){n(t)}(0,function(t){"use strict";function n(e,t){e.super_=t,e.prototype=Object.create(t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}})}function r(e,t){Object.defineProperty(this,"kind",{value:e,enumerable:!0}),t&&t.length&&Object.defineProperty(this,"path",{value:t,enumerable:!0})}function o(e,t,n){o.super_.call(this,"E",e),Object.defineProperty(this,"lhs",{value:t,enumerable:!0}),Object.defineProperty(this,"rhs",{value:n,enumerable:!0})}function a(e,t){a.super_.call(this,"N",e),Object.defineProperty(this,"rhs",{value:t,enumerable:!0})}function i(e,t){i.super_.call(this,"D",e),Object.defineProperty(this,"lhs",{value:t,enumerable:!0})}function u(e,t,n){u.super_.call(this,"A",e),Object.defineProperty(this,"index",{value:t,enumerable:!0}),Object.defineProperty(this,"item",{value:n,enumerable:!0})}function s(e,t,n){var r=e.slice((n||t)+1||e.length);return e.length=t<0?e.length+t:t,e.push.apply(e,r),e}function l(e){var t=void 0===e?"undefined":j(e);return"object"!==t?t:e===Math?"math":null===e?"null":Array.isArray(e)?"array":"[object Date]"===Object.prototype.toString.call(e)?"date":"function"==typeof e.toString&&/^\/.*\//.test(e.toString())?"regexp":"object"}function c(e,t,n,r,f,p,d){f=f||[],d=d||[];var h=f.slice(0);if(void 0!==p){if(r){if("function"==typeof r&&r(h,p))return;if("object"===(void 0===r?"undefined":j(r))){if(r.prefilter&&r.prefilter(h,p))return;if(r.normalize){var y=r.normalize(h,p,e,t);y&&(e=y[0],t=y[1])}}}h.push(p)}"regexp"===l(e)&&"regexp"===l(t)&&(e=e.toString(),t=t.toString());var v=void 0===e?"undefined":j(e),m=void 0===t?"undefined":j(t),g="undefined"!==v||d&&d[d.length-1].lhs&&d[d.length-1].lhs.hasOwnProperty(p),b="undefined"!==m||d&&d[d.length-1].rhs&&d[d.length-1].rhs.hasOwnProperty(p);if(!g&&b)n(new a(h,t));else if(!b&&g)n(new i(h,e));else if(l(e)!==l(t))n(new o(h,e,t));else if("date"===l(e)&&e-t!=0)n(new o(h,e,t));else if("object"===v&&null!==e&&null!==t)if(d.filter(function(t){return t.lhs===e}).length)e!==t&&n(new o(h,e,t));else{if(d.push({lhs:e,rhs:t}),Array.isArray(e)){var _;for(e.length,_=0;_<e.length;_++)_>=t.length?n(new u(h,_,new i(void 0,e[_]))):c(e[_],t[_],n,r,h,_,d);for(;_<t.length;)n(new u(h,_,new a(void 0,t[_++])))}else{var w=Object.keys(e),E=Object.keys(t);w.forEach(function(o,a){var i=E.indexOf(o);i>=0?(c(e[o],t[o],n,r,h,o,d),E=s(E,i)):c(e[o],void 0,n,r,h,o,d)}),E.forEach(function(e){c(void 0,t[e],n,r,h,e,d)})}d.length=d.length-1}else e!==t&&("number"===v&&isNaN(e)&&isNaN(t)||n(new o(h,e,t)))}function f(e,t,n,r){return r=r||[],c(e,t,function(e){e&&r.push(e)},n),r.length?r:void 0}function p(e,t,n){if(n.path&&n.path.length){var r,o=e[t],a=n.path.length-1;for(r=0;r<a;r++)o=o[n.path[r]];switch(n.kind){case"A":p(o[n.path[r]],n.index,n.item);break;case"D":delete o[n.path[r]];break;case"E":case"N":o[n.path[r]]=n.rhs}}else switch(n.kind){case"A":p(e[t],n.index,n.item);break;case"D":e=s(e,t);break;case"E":case"N":e[t]=n.rhs}return e}function d(e,t,n){if(e&&t&&n&&n.kind){for(var r=e,o=-1,a=n.path?n.path.length-1:0;++o<a;)void 0===r[n.path[o]]&&(r[n.path[o]]="number"==typeof n.path[o]?[]:{}),r=r[n.path[o]];switch(n.kind){case"A":p(n.path?r[n.path[o]]:r,n.index,n.item);break;case"D":delete r[n.path[o]];break;case"E":case"N":r[n.path[o]]=n.rhs}}}function h(e,t,n){if(n.path&&n.path.length){var r,o=e[t],a=n.path.length-1;for(r=0;r<a;r++)o=o[n.path[r]];switch(n.kind){case"A":h(o[n.path[r]],n.index,n.item);break;case"D":case"E":o[n.path[r]]=n.lhs;break;case"N":delete o[n.path[r]]}}else switch(n.kind){case"A":h(e[t],n.index,n.item);break;case"D":case"E":e[t]=n.lhs;break;case"N":e=s(e,t)}return e}function y(e,t,n){if(e&&t&&n&&n.kind){var r,o,a=e;for(o=n.path.length-1,r=0;r<o;r++)void 0===a[n.path[r]]&&(a[n.path[r]]={}),a=a[n.path[r]];switch(n.kind){case"A":h(a[n.path[r]],n.index,n.item);break;case"D":case"E":a[n.path[r]]=n.lhs;break;case"N":delete a[n.path[r]]}}}function v(e,t,n){if(e&&t){c(e,t,function(r){n&&!n(e,t,r)||d(e,t,r)})}}function m(e){return"color: "+M[e].color+"; font-weight: bold"}function g(e){var t=e.kind,n=e.path,r=e.lhs,o=e.rhs,a=e.index,i=e.item;switch(t){case"E":return[n.join("."),r,"→",o];case"N":return[n.join("."),o];case"D":return[n.join(".")];case"A":return[n.join(".")+"["+a+"]",i];default:return[]}}function b(e,t,n,r){var o=f(e,t);try{r?n.groupCollapsed("diff"):n.group("diff")}catch(e){n.log("diff")}o?o.forEach(function(e){var t=e.kind,r=g(e);n.log.apply(n,["%c "+M[t].text,m(t)].concat(R(r)))}):n.log("—— no diff ——");try{n.groupEnd()}catch(e){n.log("—— diff end —— ")}}function _(e,t,n,r){switch(void 0===e?"undefined":j(e)){case"object":return"function"==typeof e[r]?e[r].apply(e,R(n)):e[r];case"function":return e(t);default:return e}}function w(e){var t=e.timestamp,n=e.duration;return function(e,r,o){var a=["action"];return a.push("%c"+String(e.type)),t&&a.push("%c@ "+r),n&&a.push("%c(in "+o.toFixed(2)+" ms)"),a.join(" ")}}function E(e,t){var n=t.logger,r=t.actionTransformer,o=t.titleFormatter,a=void 0===o?w(t):o,i=t.collapsed,u=t.colors,s=t.level,l=t.diff,c=void 0===t.titleFormatter;e.forEach(function(o,f){var p=o.started,d=o.startedTime,h=o.action,y=o.prevState,v=o.error,m=o.took,g=o.nextState,w=e[f+1];w&&(g=w.prevState,m=w.started-p);var E=r(h),O="function"==typeof i?i(function(){return g},h,o):i,P=S(d),C=u.title?"color: "+u.title(E)+";":"",x=["color: gray; font-weight: lighter;"];x.push(C),t.timestamp&&x.push("color: gray; font-weight: lighter;"),t.duration&&x.push("color: gray; font-weight: lighter;");var k=a(E,P,m);try{O?u.title&&c?n.groupCollapsed.apply(n,["%c "+k].concat(x)):n.groupCollapsed(k):u.title&&c?n.group.apply(n,["%c "+k].concat(x)):n.group(k)}catch(e){n.log(k)}var T=_(s,E,[y],"prevState"),j=_(s,E,[E],"action"),R=_(s,E,[v,y],"error"),N=_(s,E,[g],"nextState");if(T)if(u.prevState){var M="color: "+u.prevState(y)+"; font-weight: bold";n[T]("%c prev state",M,y)}else n[T]("prev state",y);if(j)if(u.action){var I="color: "+u.action(E)+"; font-weight: bold";n[j]("%c action    ",I,E)}else n[j]("action    ",E);if(v&&R)if(u.error){var A="color: "+u.error(v,y)+"; font-weight: bold;";n[R]("%c error     ",A,v)}else n[R]("error     ",v);if(N)if(u.nextState){var D="color: "+u.nextState(g)+"; font-weight: bold";n[N]("%c next state",D,g)}else n[N]("next state",g);l&&b(y,g,n,O);try{n.groupEnd()}catch(e){n.log("—— log end ——")}})}function O(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=Object.assign({},I,e),n=t.logger,r=t.stateTransformer,o=t.errorTransformer,a=t.predicate,i=t.logErrors,u=t.diffPredicate;if(void 0===n)return function(){return function(e){return function(t){return e(t)}}};if(e.getState&&e.dispatch)return console.error("[redux-logger] redux-logger not installed. Make sure to pass logger instance as middleware:\n// Logger with default options\nimport { logger } from 'redux-logger'\nconst store = createStore(\n  reducer,\n  applyMiddleware(logger)\n)\n// Or you can create your own logger with custom options http://bit.ly/redux-logger-options\nimport createLogger from 'redux-logger'\nconst logger = createLogger({\n  // ...options\n});\nconst store = createStore(\n  reducer,\n  applyMiddleware(logger)\n)\n"),function(){return function(e){return function(t){return e(t)}}};var s=[];return function(e){var n=e.getState;return function(e){return function(l){if("function"==typeof a&&!a(n,l))return e(l);var c={};s.push(c),c.started=T.now(),c.startedTime=new Date,c.prevState=r(n()),c.action=l;var f=void 0;if(i)try{f=e(l)}catch(e){c.error=o(e)}else f=e(l);c.took=T.now()-c.started,c.nextState=r(n());var p=t.diff&&"function"==typeof u?u(n,l):t.diff;if(E(s,Object.assign({},t,{diff:p})),s.length=0,c.error)throw c.error;return f}}}}var P,C,x=function(e,t){return new Array(t+1).join(e)},k=function(e,t){return x("0",t-e.toString().length)+e},S=function(e){return k(e.getHours(),2)+":"+k(e.getMinutes(),2)+":"+k(e.getSeconds(),2)+"."+k(e.getMilliseconds(),3)},T="undefined"!=typeof performance&&null!==performance&&"function"==typeof performance.now?performance:Date,j="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},R=function(e){if(Array.isArray(e)){for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t];return n}return Array.from(e)},N=[];P="object"===(void 0===e?"undefined":j(e))&&e?e:"undefined"!=typeof window?window:{},C=P.DeepDiff,C&&N.push(function(){void 0!==C&&P.DeepDiff===f&&(P.DeepDiff=C,C=void 0)}),n(o,r),n(a,r),n(i,r),n(u,r),Object.defineProperties(f,{diff:{value:f,enumerable:!0},observableDiff:{value:c,enumerable:!0},applyDiff:{value:v,enumerable:!0},applyChange:{value:d,enumerable:!0},revertChange:{value:y,enumerable:!0},isConflict:{value:function(){return void 0!==C},enumerable:!0},noConflict:{value:function(){return N&&(N.forEach(function(e){e()}),N=null),f},enumerable:!0}});var M={E:{color:"#2196F3",text:"CHANGED:"},N:{color:"#4CAF50",text:"ADDED:"},D:{color:"#F44336",text:"DELETED:"},A:{color:"#2196F3",text:"ARRAY:"}},I={level:"log",logger:console,logErrors:!0,collapsed:void 0,predicate:void 0,duration:!1,timestamp:!0,stateTransformer:function(e){return e},actionTransformer:function(e){return e},errorTransformer:function(e){return e},colors:{title:function(){return"inherit"},prevState:function(){return"#9E9E9E"},action:function(){return"#03A9F4"},nextState:function(){return"#4CAF50"},error:function(){return"#F20404"}},diff:!1,diffPredicate:void 0,transformer:void 0},A=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=e.dispatch,n=e.getState;return"function"==typeof t||"function"==typeof n?O()({dispatch:t,getState:n}):void console.error("\n[redux-logger v3] BREAKING CHANGE\n[redux-logger v3] Since 3.0.0 redux-logger exports by default logger with default settings.\n[redux-logger v3] Change\n[redux-logger v3] import createLogger from 'redux-logger'\n[redux-logger v3] to\n[redux-logger v3] import { createLogger } from 'redux-logger'\n")};t.defaults=I,t.createLogger=O,t.logger=A,t.default=A,Object.defineProperty(t,"__esModule",{value:!0})})}).call(t,n(36))},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var o=n(47),a=n(444),i=r(a),u=n(447),s=r(u),l=n(448),c=r(l),f=n(449),p=r(f),d=n(450),h=r(d),y=n(451),v=r(y);t.default=(0,o.combineReducers)({errors:i.default,session:s.default,playlists:c.default,songs:p.default,playback:h.default,users:v.default})},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var o=n(47),a=n(445),i=r(a),u=n(446),s=r(u);t.default=(0,o.combineReducers)({session:i.default,playlist:s.default})},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(21),o=(function(e){e&&e.__esModule}(r),n(20)),a=[],i=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:a,t=arguments[1];switch(Object.freeze(e),t.type){case o.RECEIVE_SESSION_ERRORS:return t.errors;case o.RECEIVE_CURRENT_USER:return a;default:return e}};t.default=i},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(21),o=(function(e){e&&e.__esModule}(r),n(15)),a=[],i=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:a,t=arguments[1];switch(Object.freeze(e),t.type){case o.RECEIVE_PLAYLIST_ERRORS:return t.errors;case o.RECEIVE_PLAYLISTS:case o.RECEIVE_PLAYLIST:case o.REMOVE_PLAYLIST:return a;default:return e}};t.default=i},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(21),o=function(e){return e&&e.__esModule?e:{default:e}}(r),a=n(20),i=n(15),u=n(29),s=Object.freeze({currentUser:null}),l=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:s,t=arguments[1];switch(Object.freeze(e),t.type){case a.RECEIVE_CURRENT_USER:var n=t.currentUser;return n?(n=n.user_details,(0,o.default)({},{currentUser:n})):(0,o.default)({},{currentUser:n});case i.RECEIVE_PLAYLIST:var r=(0,o.default)({},e),l=t.playlist.playlist_detail[parseInt(Object.keys(t.playlist.playlist_detail)[0])];return l.author_id!==e.currentUser.id||e.currentUser.playlists_ids.includes(l.id)||r.currentUser.playlists_ids.push(l.id),r;case i.REMOVE_PLAYLIST:var c=(0,o.default)({},e),f=t.playlist.playlist_detail[parseInt(Object.keys(t.playlist.playlist_detail)[0])],p=e.currentUser.playlists_ids.indexOf(f.id);return-1!==p&&c.currentUser.playlists_ids.splice(p,1),c;case i.FOLLOW_PLAYLIST:r=(0,o.default)({},e);var d=t.playlist.playlist_detail[parseInt(Object.keys(t.playlist.playlist_detail)[0])];return d.user_follows&&-1===e.currentUser.follow_playlists_ids.indexOf(d.id)&&r.currentUser.follow_playlists_ids.push(d.id),r;case i.UNFOLLOW_PLAYLIST:r=(0,o.default)({},e);var h=t.playlist.playlist_detail[parseInt(Object.keys(t.playlist.playlist_detail)[0])];if(!h.user_follows){var y=e.currentUser.follow_playlists_ids.indexOf(h.id);-1!==y&&r.currentUser.follow_playlists_ids.splice(y,1)}return r;case u.FRIEND_USER:r=(0,o.default)({},e);var v=t.user.user_details;return v.user_friend&&-1===e.currentUser.friend_ids.indexOf(v.id)&&r.currentUser.friend_ids.push(v.id),r;case u.UNFRIEND_USER:r=(0,o.default)({},e);var m=t.user.user_details;if(!m.user_friend){var g=e.currentUser.friend_ids.indexOf(m.id);-1!==g&&r.currentUser.friend_ids.splice(g,1)}return r;default:return e}};t.default=l},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(21),o=function(e){return e&&e.__esModule?e:{default:e}}(r),a=n(15),i=n(29),u=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=arguments[1];Object.freeze(e);var n={},r=void 0;switch(t.type){case a.RECEIVE_PLAYLISTS:return(0,o.default)({},e,t.playlists.playlist_detail);case a.RECEIVE_PLAYLIST:case a.FOLLOW_PLAYLIST:case a.UNFOLLOW_PLAYLIST:return n=(0,o.default)({},e),r=parseInt(Object.keys(t.playlist.playlist_detail)[0]),n[r]=t.playlist.playlist_detail[r],n;case i.RECEIVE_USER:if(n=(0,o.default)({},e),t.user.playlist_detail){Object.values(t.user.playlist_detail).forEach(function(e){n[e.id]=e})}return n;case a.REMOVE_PLAYLIST:return n=(0,o.default)({},e),delete n[parseInt(Object.keys(t.playlist.playlist_detail)[0])],n;default:return e}};t.default=u},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(21),o=function(e){return e&&e.__esModule?e:{default:e}}(r),a=n(15),i=n(29),u=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=arguments[1];Object.freeze(e);switch(t.type){case a.RECEIVE_PLAYLISTS:return(0,o.default)({},e,t.playlists.songs_detail);case a.RECEIVE_PLAYLIST:return(0,o.default)({},e,t.playlist.songs_detail);case i.RECEIVE_USER:var n=t.user.songs_detail;return n?(0,o.default)({},e,n):e;case a.REMOVE_PLAYLIST:default:return e}};t.default=u},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(21),o=function(e){return e&&e.__esModule?e:{default:e}}(r),a=n(147),i=n(15),u=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=arguments[1];Object.freeze(e);var n={};switch(t.type){case a.REPRODUCE_COLLECTION:return{collection:t.collection,song_ids:t.collection.song_ids};case i.RECEIVE_PLAYLIST:return n=(0,o.default)({},e),e.collection&&t.playlist.playlist_detail[e.collection.id]&&(n.collection.song_ids=t.playlist.playlist_detail[e.collection.id].song_ids,n.song_ids=t.playlist.playlist_detail[e.collection.id].song_ids),n;default:return e}};t.default=u},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(21),o=function(e){return e&&e.__esModule?e:{default:e}}(r),a=n(29),i=n(20),u=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=arguments[1];Object.freeze(e);var n={};switch(t.type){case i.RECEIVE_CURRENT_USER:n=(0,o.default)({},e);var r=t.friends_details;return r&&Object.values(r).forEach(function(e){n[e.id]=e}),n;case a.RECEIVE_USER:case a.FRIEND_USER:case a.UNFRIEND_USER:n=(0,o.default)({},e);var u=t.user.user_details,s=t.user.friends_details;return n[u.id]=u,s&&Object.values(s).forEach(function(e){n[e.id]=e}),n;default:return e}};t.default=u}]);
(function() {
  var context = this;

  (function() {
    (function() {
      var slice = [].slice;

      this.ActionCable = {
        INTERNAL: {
          "message_types": {
            "welcome": "welcome",
            "ping": "ping",
            "confirmation": "confirm_subscription",
            "rejection": "reject_subscription"
          },
          "default_mount_path": "/cable",
          "protocols": ["actioncable-v1-json", "actioncable-unsupported"]
        },
        WebSocket: window.WebSocket,
        logger: window.console,
        createConsumer: function(url) {
          var ref;
          if (url == null) {
            url = (ref = this.getConfig("url")) != null ? ref : this.INTERNAL.default_mount_path;
          }
          return new ActionCable.Consumer(this.createWebSocketURL(url));
        },
        getConfig: function(name) {
          var element;
          element = document.head.querySelector("meta[name='action-cable-" + name + "']");
          return element != null ? element.getAttribute("content") : void 0;
        },
        createWebSocketURL: function(url) {
          var a;
          if (url && !/^wss?:/i.test(url)) {
            a = document.createElement("a");
            a.href = url;
            a.href = a.href;
            a.protocol = a.protocol.replace("http", "ws");
            return a.href;
          } else {
            return url;
          }
        },
        startDebugging: function() {
          return this.debugging = true;
        },
        stopDebugging: function() {
          return this.debugging = null;
        },
        log: function() {
          var messages, ref;
          messages = 1 <= arguments.length ? slice.call(arguments, 0) : [];
          if (this.debugging) {
            messages.push(Date.now());
            return (ref = this.logger).log.apply(ref, ["[ActionCable]"].concat(slice.call(messages)));
          }
        }
      };

    }).call(this);
  }).call(context);

  var ActionCable = context.ActionCable;

  (function() {
    (function() {
      var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

      ActionCable.ConnectionMonitor = (function() {
        var clamp, now, secondsSince;

        ConnectionMonitor.pollInterval = {
          min: 3,
          max: 30
        };

        ConnectionMonitor.staleThreshold = 6;

        function ConnectionMonitor(connection) {
          this.connection = connection;
          this.visibilityDidChange = bind(this.visibilityDidChange, this);
          this.reconnectAttempts = 0;
        }

        ConnectionMonitor.prototype.start = function() {
          if (!this.isRunning()) {
            this.startedAt = now();
            delete this.stoppedAt;
            this.startPolling();
            document.addEventListener("visibilitychange", this.visibilityDidChange);
            return ActionCable.log("ConnectionMonitor started. pollInterval = " + (this.getPollInterval()) + " ms");
          }
        };

        ConnectionMonitor.prototype.stop = function() {
          if (this.isRunning()) {
            this.stoppedAt = now();
            this.stopPolling();
            document.removeEventListener("visibilitychange", this.visibilityDidChange);
            return ActionCable.log("ConnectionMonitor stopped");
          }
        };

        ConnectionMonitor.prototype.isRunning = function() {
          return (this.startedAt != null) && (this.stoppedAt == null);
        };

        ConnectionMonitor.prototype.recordPing = function() {
          return this.pingedAt = now();
        };

        ConnectionMonitor.prototype.recordConnect = function() {
          this.reconnectAttempts = 0;
          this.recordPing();
          delete this.disconnectedAt;
          return ActionCable.log("ConnectionMonitor recorded connect");
        };

        ConnectionMonitor.prototype.recordDisconnect = function() {
          this.disconnectedAt = now();
          return ActionCable.log("ConnectionMonitor recorded disconnect");
        };

        ConnectionMonitor.prototype.startPolling = function() {
          this.stopPolling();
          return this.poll();
        };

        ConnectionMonitor.prototype.stopPolling = function() {
          return clearTimeout(this.pollTimeout);
        };

        ConnectionMonitor.prototype.poll = function() {
          return this.pollTimeout = setTimeout((function(_this) {
            return function() {
              _this.reconnectIfStale();
              return _this.poll();
            };
          })(this), this.getPollInterval());
        };

        ConnectionMonitor.prototype.getPollInterval = function() {
          var interval, max, min, ref;
          ref = this.constructor.pollInterval, min = ref.min, max = ref.max;
          interval = 5 * Math.log(this.reconnectAttempts + 1);
          return Math.round(clamp(interval, min, max) * 1000);
        };

        ConnectionMonitor.prototype.reconnectIfStale = function() {
          if (this.connectionIsStale()) {
            ActionCable.log("ConnectionMonitor detected stale connection. reconnectAttempts = " + this.reconnectAttempts + ", pollInterval = " + (this.getPollInterval()) + " ms, time disconnected = " + (secondsSince(this.disconnectedAt)) + " s, stale threshold = " + this.constructor.staleThreshold + " s");
            this.reconnectAttempts++;
            if (this.disconnectedRecently()) {
              return ActionCable.log("ConnectionMonitor skipping reopening recent disconnect");
            } else {
              ActionCable.log("ConnectionMonitor reopening");
              return this.connection.reopen();
            }
          }
        };

        ConnectionMonitor.prototype.connectionIsStale = function() {
          var ref;
          return secondsSince((ref = this.pingedAt) != null ? ref : this.startedAt) > this.constructor.staleThreshold;
        };

        ConnectionMonitor.prototype.disconnectedRecently = function() {
          return this.disconnectedAt && secondsSince(this.disconnectedAt) < this.constructor.staleThreshold;
        };

        ConnectionMonitor.prototype.visibilityDidChange = function() {
          if (document.visibilityState === "visible") {
            return setTimeout((function(_this) {
              return function() {
                if (_this.connectionIsStale() || !_this.connection.isOpen()) {
                  ActionCable.log("ConnectionMonitor reopening stale connection on visibilitychange. visbilityState = " + document.visibilityState);
                  return _this.connection.reopen();
                }
              };
            })(this), 200);
          }
        };

        now = function() {
          return new Date().getTime();
        };

        secondsSince = function(time) {
          return (now() - time) / 1000;
        };

        clamp = function(number, min, max) {
          return Math.max(min, Math.min(max, number));
        };

        return ConnectionMonitor;

      })();

    }).call(this);
    (function() {
      var i, message_types, protocols, ref, supportedProtocols, unsupportedProtocol,
        slice = [].slice,
        bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
        indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

      ref = ActionCable.INTERNAL, message_types = ref.message_types, protocols = ref.protocols;

      supportedProtocols = 2 <= protocols.length ? slice.call(protocols, 0, i = protocols.length - 1) : (i = 0, []), unsupportedProtocol = protocols[i++];

      ActionCable.Connection = (function() {
        Connection.reopenDelay = 500;

        function Connection(consumer) {
          this.consumer = consumer;
          this.open = bind(this.open, this);
          this.subscriptions = this.consumer.subscriptions;
          this.monitor = new ActionCable.ConnectionMonitor(this);
          this.disconnected = true;
        }

        Connection.prototype.send = function(data) {
          if (this.isOpen()) {
            this.webSocket.send(JSON.stringify(data));
            return true;
          } else {
            return false;
          }
        };

        Connection.prototype.open = function() {
          if (this.isActive()) {
            ActionCable.log("Attempted to open WebSocket, but existing socket is " + (this.getState()));
            return false;
          } else {
            ActionCable.log("Opening WebSocket, current state is " + (this.getState()) + ", subprotocols: " + protocols);
            if (this.webSocket != null) {
              this.uninstallEventHandlers();
            }
            this.webSocket = new ActionCable.WebSocket(this.consumer.url, protocols);
            this.installEventHandlers();
            this.monitor.start();
            return true;
          }
        };

        Connection.prototype.close = function(arg) {
          var allowReconnect, ref1;
          allowReconnect = (arg != null ? arg : {
            allowReconnect: true
          }).allowReconnect;
          if (!allowReconnect) {
            this.monitor.stop();
          }
          if (this.isActive()) {
            return (ref1 = this.webSocket) != null ? ref1.close() : void 0;
          }
        };

        Connection.prototype.reopen = function() {
          var error;
          ActionCable.log("Reopening WebSocket, current state is " + (this.getState()));
          if (this.isActive()) {
            try {
              return this.close();
            } catch (error1) {
              error = error1;
              return ActionCable.log("Failed to reopen WebSocket", error);
            } finally {
              ActionCable.log("Reopening WebSocket in " + this.constructor.reopenDelay + "ms");
              setTimeout(this.open, this.constructor.reopenDelay);
            }
          } else {
            return this.open();
          }
        };

        Connection.prototype.getProtocol = function() {
          var ref1;
          return (ref1 = this.webSocket) != null ? ref1.protocol : void 0;
        };

        Connection.prototype.isOpen = function() {
          return this.isState("open");
        };

        Connection.prototype.isActive = function() {
          return this.isState("open", "connecting");
        };

        Connection.prototype.isProtocolSupported = function() {
          var ref1;
          return ref1 = this.getProtocol(), indexOf.call(supportedProtocols, ref1) >= 0;
        };

        Connection.prototype.isState = function() {
          var ref1, states;
          states = 1 <= arguments.length ? slice.call(arguments, 0) : [];
          return ref1 = this.getState(), indexOf.call(states, ref1) >= 0;
        };

        Connection.prototype.getState = function() {
          var ref1, state, value;
          for (state in WebSocket) {
            value = WebSocket[state];
            if (value === ((ref1 = this.webSocket) != null ? ref1.readyState : void 0)) {
              return state.toLowerCase();
            }
          }
          return null;
        };

        Connection.prototype.installEventHandlers = function() {
          var eventName, handler;
          for (eventName in this.events) {
            handler = this.events[eventName].bind(this);
            this.webSocket["on" + eventName] = handler;
          }
        };

        Connection.prototype.uninstallEventHandlers = function() {
          var eventName;
          for (eventName in this.events) {
            this.webSocket["on" + eventName] = function() {};
          }
        };

        Connection.prototype.events = {
          message: function(event) {
            var identifier, message, ref1, type;
            if (!this.isProtocolSupported()) {
              return;
            }
            ref1 = JSON.parse(event.data), identifier = ref1.identifier, message = ref1.message, type = ref1.type;
            switch (type) {
              case message_types.welcome:
                this.monitor.recordConnect();
                return this.subscriptions.reload();
              case message_types.ping:
                return this.monitor.recordPing();
              case message_types.confirmation:
                return this.subscriptions.notify(identifier, "connected");
              case message_types.rejection:
                return this.subscriptions.reject(identifier);
              default:
                return this.subscriptions.notify(identifier, "received", message);
            }
          },
          open: function() {
            ActionCable.log("WebSocket onopen event, using '" + (this.getProtocol()) + "' subprotocol");
            this.disconnected = false;
            if (!this.isProtocolSupported()) {
              ActionCable.log("Protocol is unsupported. Stopping monitor and disconnecting.");
              return this.close({
                allowReconnect: false
              });
            }
          },
          close: function(event) {
            ActionCable.log("WebSocket onclose event");
            if (this.disconnected) {
              return;
            }
            this.disconnected = true;
            this.monitor.recordDisconnect();
            return this.subscriptions.notifyAll("disconnected", {
              willAttemptReconnect: this.monitor.isRunning()
            });
          },
          error: function() {
            return ActionCable.log("WebSocket onerror event");
          }
        };

        return Connection;

      })();

    }).call(this);
    (function() {
      var slice = [].slice;

      ActionCable.Subscriptions = (function() {
        function Subscriptions(consumer) {
          this.consumer = consumer;
          this.subscriptions = [];
        }

        Subscriptions.prototype.create = function(channelName, mixin) {
          var channel, params, subscription;
          channel = channelName;
          params = typeof channel === "object" ? channel : {
            channel: channel
          };
          subscription = new ActionCable.Subscription(this.consumer, params, mixin);
          return this.add(subscription);
        };

        Subscriptions.prototype.add = function(subscription) {
          this.subscriptions.push(subscription);
          this.consumer.ensureActiveConnection();
          this.notify(subscription, "initialized");
          this.sendCommand(subscription, "subscribe");
          return subscription;
        };

        Subscriptions.prototype.remove = function(subscription) {
          this.forget(subscription);
          if (!this.findAll(subscription.identifier).length) {
            this.sendCommand(subscription, "unsubscribe");
          }
          return subscription;
        };

        Subscriptions.prototype.reject = function(identifier) {
          var i, len, ref, results, subscription;
          ref = this.findAll(identifier);
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            subscription = ref[i];
            this.forget(subscription);
            this.notify(subscription, "rejected");
            results.push(subscription);
          }
          return results;
        };

        Subscriptions.prototype.forget = function(subscription) {
          var s;
          this.subscriptions = (function() {
            var i, len, ref, results;
            ref = this.subscriptions;
            results = [];
            for (i = 0, len = ref.length; i < len; i++) {
              s = ref[i];
              if (s !== subscription) {
                results.push(s);
              }
            }
            return results;
          }).call(this);
          return subscription;
        };

        Subscriptions.prototype.findAll = function(identifier) {
          var i, len, ref, results, s;
          ref = this.subscriptions;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            s = ref[i];
            if (s.identifier === identifier) {
              results.push(s);
            }
          }
          return results;
        };

        Subscriptions.prototype.reload = function() {
          var i, len, ref, results, subscription;
          ref = this.subscriptions;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            subscription = ref[i];
            results.push(this.sendCommand(subscription, "subscribe"));
          }
          return results;
        };

        Subscriptions.prototype.notifyAll = function() {
          var args, callbackName, i, len, ref, results, subscription;
          callbackName = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
          ref = this.subscriptions;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            subscription = ref[i];
            results.push(this.notify.apply(this, [subscription, callbackName].concat(slice.call(args))));
          }
          return results;
        };

        Subscriptions.prototype.notify = function() {
          var args, callbackName, i, len, results, subscription, subscriptions;
          subscription = arguments[0], callbackName = arguments[1], args = 3 <= arguments.length ? slice.call(arguments, 2) : [];
          if (typeof subscription === "string") {
            subscriptions = this.findAll(subscription);
          } else {
            subscriptions = [subscription];
          }
          results = [];
          for (i = 0, len = subscriptions.length; i < len; i++) {
            subscription = subscriptions[i];
            results.push(typeof subscription[callbackName] === "function" ? subscription[callbackName].apply(subscription, args) : void 0);
          }
          return results;
        };

        Subscriptions.prototype.sendCommand = function(subscription, command) {
          var identifier;
          identifier = subscription.identifier;
          return this.consumer.send({
            command: command,
            identifier: identifier
          });
        };

        return Subscriptions;

      })();

    }).call(this);
    (function() {
      ActionCable.Subscription = (function() {
        var extend;

        function Subscription(consumer, params, mixin) {
          this.consumer = consumer;
          if (params == null) {
            params = {};
          }
          this.identifier = JSON.stringify(params);
          extend(this, mixin);
        }

        Subscription.prototype.perform = function(action, data) {
          if (data == null) {
            data = {};
          }
          data.action = action;
          return this.send(data);
        };

        Subscription.prototype.send = function(data) {
          return this.consumer.send({
            command: "message",
            identifier: this.identifier,
            data: JSON.stringify(data)
          });
        };

        Subscription.prototype.unsubscribe = function() {
          return this.consumer.subscriptions.remove(this);
        };

        extend = function(object, properties) {
          var key, value;
          if (properties != null) {
            for (key in properties) {
              value = properties[key];
              object[key] = value;
            }
          }
          return object;
        };

        return Subscription;

      })();

    }).call(this);
    (function() {
      ActionCable.Consumer = (function() {
        function Consumer(url) {
          this.url = url;
          this.subscriptions = new ActionCable.Subscriptions(this);
          this.connection = new ActionCable.Connection(this);
        }

        Consumer.prototype.send = function(data) {
          return this.connection.send(data);
        };

        Consumer.prototype.connect = function() {
          return this.connection.open();
        };

        Consumer.prototype.disconnect = function() {
          return this.connection.close({
            allowReconnect: false
          });
        };

        Consumer.prototype.ensureActiveConnection = function() {
          if (!this.connection.isActive()) {
            return this.connection.open();
          }
        };

        return Consumer;

      })();

    }).call(this);
  }).call(this);

  if (typeof module === "object" && module.exports) {
    module.exports = ActionCable;
  } else if (typeof define === "function" && define.amd) {
    define(ActionCable);
  }
}).call(this);
// Action Cable provides the framework to deal with WebSockets in Rails.
// You can generate new channels where WebSocket features live using the `rails generate channel` command.
//




(function() {
  this.App || (this.App = {});

  App.cable = ActionCable.createConsumer();

}).call(this);
(function() {


}).call(this);
// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, or any plugin's
// vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//




;
