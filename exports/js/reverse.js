(function() {
  var ReverseMap, s, setText;

  s = Snap("#canvas").attr({
    width: $("div.col-xs-10").width(),
    height: $(window).height(),
    viewBox: [0, 0, 400, 400]
  });

  setText = function(id, text) {
    $("#" + id).html(text);
  };

  ReverseMap = function(dataStore) {
    var self;
    self = this;
    this.dataStore = dataStore;
  };

  window.ReverseMap = ReverseMap;

  ReverseMap.BLOCK = 0;

  ReverseMap.EMPTY = 1;

  ReverseMap.WHITE = 2;

  ReverseMap.BLACK = 3;

  ReverseMap.prototype.enemy = function(cb) {
    this.ai_script = cb;
  };

  ReverseMap.prototype.turn = function() {
    if (this.current_color === ReverseMap.WHITE) {
      this.current_color = ReverseMap.BLACK;
      setText("turn", "●(黒)の番");
    } else if (this.current_color === ReverseMap.BLACK) {
      this.current_color = ReverseMap.WHITE;
      setText("turn", "○(白)の番");
    }
  };

  ReverseMap.prototype.init = function(my_color) {
    var i, self;
    self = this;
    this.map = new Map;
    this.map.init();
    this.data = [];
    this.current_color = ReverseMap.WHITE;
    i = 0;
    while (i < 8 * 8) {
      this.data[i] = ReverseMap.EMPTY;
      i++;
    }
    this.map.click = function(x, y) {
      if (self.my_color === self.current_color) {
        self.dataStore.set(x + "-" + y, {
          color: self.current_color
        });
      }
    };
    this.dataStore.on("set", function(e) {
      var pos;
      pos = e.id.split("-");
      self.put(Number(pos[0]), Number(pos[1]), e.value.color);
    });
    this.my_color = my_color;
    if (this.my_color === ReverseMap.WHITE) {
      setText("my-color", "あなたは○(白)です。");
    } else if (this.my_color === ReverseMap.BLACK) {
      setText("my-color", "あなたは●(黒)です。");
    }
    this.change_color(3, 3, ReverseMap.BLACK);
    this.change_color(3, 4, ReverseMap.WHITE);
    this.change_color(4, 3, ReverseMap.WHITE);
    this.change_color(4, 4, ReverseMap.BLACK);
  };

  ReverseMap.prototype.put = function(x, y, color, fire) {
    if (this.check(x, y, color)) {
      this.change_color(x, y, color);
      this.turn();
    }
  };

  ReverseMap.prototype.check = function(x, y, color) {
    return this.check_part(x - 1, y, color, [-1, 0]) > 1 || this.check_part(x + 1, y, color, [1, 0]) > 1 || this.check_part(x, y + 1, color, [0, 1]) > 1 || this.check_part(x, y - 1, color, [0, -1]) > 1 || this.check_part(x - 1, y - 1, color, [-1, -1]) > 1 || this.check_part(x + 1, y + 1, color, [1, 1]) > 1 || this.check_part(x - 1, y + 1, color, [-1, 1]) > 1 || this.check_part(x + 1, y - 1, color, [1, -1]) > 1;
  };

  ReverseMap.prototype.check_part = function(x, y, color, d) {
    var c, col;
    col = this.get_color(x, y);
    if (col === ReverseMap.BLOCK) {
      return 0;
    } else if (col === ReverseMap.EMPTY) {
      return 0;
    } else {
      if (col === color) {
        return 1;
      } else {
        c = this.check_part(x + d[0], y + d[1], color, d);
        if (c > 0) {
          this.change_color(x, y, color);
          return c + 1;
        }
      }
    }
    return 0;
  };

  ReverseMap.prototype.change_color = function(x, y, color) {
    this.map.put(x, y, color);
    this.set_color(x, y, color);
  };

  ReverseMap.prototype.get_color = function(x, y) {
    if (x >= 0 && y >= 0 && x < 8 && y < 8) {
      return this.data[x + y * 8];
    } else {
      return ReverseMap.BLOCK;
    }
  };

  ReverseMap.prototype.set_color = function(x, y, color) {
    if (x >= 0 && y >= 0 && x < 8 && y < 8) {
      this.data[x + y * 8] = color;
      return color;
    } else {
      return ReverseMap.BLOCK;
    }
  };

  Map.prototype.init = function() {
    var i, j;
    i = 0;
    j = 0;
    while (i < 8) {
      while (j < 8) {
        this.putEmpty(i, j);
        j++;
      }
      i++;
      j = 0;
    }
  };

  Map.prototype.put = function(x, y, color) {
    var elem, shadow;
    shadow = s.circle(20, 20, 20);
    shadow.attr({
      cx: 24,
      cy: 28,
      fill: "Gray",
      stroke: "#000",
      strokeWidth: 1
    });
    shadow.transform("translate(" + x * 50 + "," + y * 50 + ")");
    elem = s.circle(20, 20, 20);
    elem.attr({
      cx: 24,
      cy: 25,
      fill: color === ReverseMap.WHITE ? "#fff" : "#000",
      stroke: "#000",
      strokeWidth: 1
    });
    elem.transform("translate(" + x * 50 + "," + y * 50 + ")");
  };

  Map.prototype.putEmpty = function(x, y) {
    var elem, self;
    self = this;
    elem = s.rect(0, 0, 50, 50);
    elem.attr({
      fill: "LimeGreen",
      stroke: "DarkGreen",
      strokeWidth: 3
    });
    elem.transform("translate(" + x * 50 + "," + y * 50 + ")");
    elem.click(function() {
      self.click(x, y);
    });
  };

  return;

}).call(this);
