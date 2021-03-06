/* global jQuery */
'use strict';
;(function ( $, window, document, undefined ) {

    var pluginName = 'lichtbrett',
        defaults = {
            x: 8,
            y: 16,
            color: 'white'
        };

    function Plugin( element, options ) {
        this.el = element;
        this.$el = $(element);

        this.options = $.extend( {
            clickable: false
        }, defaults, options);
        this.$cells = [];

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }
	
	/* hackhackhackhackhackhackhackhackhackhackhackhackhackhackhackhackhackhackhack */
	var spacerImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAMAAAAoyzS7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpGNzlFNTA4MzEwQ0IxMUUzODc4NkNBMzgwNUU3QjM4QyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpGNzlFNTA4NDEwQ0IxMUUzODc4NkNBMzgwNUU3QjM4QyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkY3OUU1MDgxMTBDQjExRTM4Nzg2Q0EzODA1RTdCMzhDIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkY3OUU1MDgyMTBDQjExRTM4Nzg2Q0EzODA1RTdCMzhDIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+uq4hXgAAAAZQTFRF////AAAAVcLTfgAAAAF0Uk5TAEDm2GYAAAAMSURBVHjaYmAACDAAAAIAAU9tWeEAAAAASUVORK5CYII=';
	/* hackhackhackhackhackhackhackhackhackhackhackhackhackhackhackhackhackhackhack */


    Plugin.prototype = {

        init: function() {
           
            var self = this;
            this.$el.addClass('jq-lichtbrett');

            var table = document.createElement('table'),
                x, y;

            for(x=0; x<this.options.x; x++) {

                var tr = document.createElement('tr');
                table.appendChild(tr);

                this.$cells.push([]);

                for(y=0; y<this.options.y; y++) {

                    var td = document.createElement('td'),
                    spacer = document.createElement('img');

                    $(spacer).attr('src', spacerImage).addClass('spacer');

                    td.appendChild(spacer);
                    tr.appendChild(td);

                    $(td)
                    .attr('jq-lichtbrett-row', x)
                    .attr('jq-lichtbrett-col', y)
                    .bind('click', function(evnt) {
                        self.onClickCell(evnt, self.options.color);
                    })
                    .bind('dragover', function(evnt) {
                        self.onClickCell(evnt, self.options.color);
                    })
                    .bind('contextmenu', function(evnt) {
                        evnt.preventDefault();
                        self.onClickCell(evnt, 'black');
                    });

                    this.$cells[this.$cells.length-1].push($(td));

                }
            }

            this.el.appendChild(table);

        },

        set: function(row, col, color, trigger) {

            trigger = (trigger===undefined) ? true : (trigger===true);

            if(this.$cells[row] && this.$cells[row][col]) {

                this.$cells[row][col].css('background-color', color);

                if(trigger)
                    this.onChange();

                return true;

            }

            return false;

        },

        setData: function(data) {

            var self = this;

            $.each(data, function(row) {

                $.each(data[row], function(col) {
                    
                    self.set(row, col, data[row][col], false);

                });

            });

            this.onChange();

        },

        getData: function() {

            var out = [],
                self = this;

            $.each(this.$cells, function(row) {

                // add new row to output
                out.push([]);

                $.each(self.$cells[row], function(col) {
                    out[out.length-1].push(self.$cells[row][col].css('background-color'));
                });

            });

            return out;
        },

        setOptions: function(options) {

            this.options = $.extend(this.options, options);

        },

        onClickCell: function(evnt, color) {
            var $t = $(evnt.currentTarget);
            
            this.set($t.attr('jq-lichtbrett-row'), $t.attr('jq-lichtbrett-col'), color);
        },

        onChange: function() {
            this.$el.trigger('change', [this.getData()]);
        }

    };

    $.fn[pluginName] = function ( options ) {

        return this.each(function () {

            if (!$.data(this, "plugin_" + pluginName)) {

                $.data(this, "plugin_" + pluginName,
                new Plugin( this, options ));

            } else {
                
                if(options instanceof Array) {
                    $.data(this, "plugin_" + pluginName).setData(options);
                } else {
                    $.data(this, "plugin_" + pluginName).setOptions(options);
                }

            }

        });
    };

})( jQuery, window, document );