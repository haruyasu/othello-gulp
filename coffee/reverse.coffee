  s = Snap("#canvas").attr(
    width: $("div.col-xs-10").width()
    height: $(window).height()
    viewBox: [0, 0, 400, 400])

  setText = (id, text) ->
    $("#" + id).html text
    return

  ReverseMap = (dataStore) ->
    self = this
    @dataStore = dataStore
    return

  window.ReverseMap = ReverseMap
  ReverseMap.BLOCK = 0
  ReverseMap.EMPTY = 1
  ReverseMap.WHITE = 2
  ReverseMap.BLACK = 3

  ReverseMap::enemy = (cb) ->
    @ai_script = cb
    return

  ReverseMap::turn = ->
    if this.current_color == ReverseMap.WHITE
      @current_color = ReverseMap.BLACK
      setText "turn", "●(黒)の番"
    else if this.current_color == ReverseMap.BLACK
      @current_color = ReverseMap.WHITE
      setText "turn", "○(白)の番"
    return

  ReverseMap::init = (my_color) ->
    self = this
    @map = new Map
    @map.init()
    @data = []
    @current_color = ReverseMap.WHITE

    i = 0
    while i < 8 * 8
        @data[i] = ReverseMap.EMPTY
        i++

    @map.click = (x, y) ->
      if self.my_color == self.current_color
        self.dataStore.set x + "-" + y, color: self.current_color
      return

    @dataStore.on "set", (e) ->
      pos = e.id.split("-")
      self.put Number(pos[0]), Number(pos[1]), e.value.color
      return
    @my_color = my_color
    if this.my_color == ReverseMap.WHITE
      setText "my-color", "あなたは○(白)です。"
    else if this.my_color == ReverseMap.BLACK
      setText "my-color", "あなたは●(黒)です。"
    @change_color 3, 3, ReverseMap.BLACK
    @change_color 3, 4, ReverseMap.WHITE
    @change_color 4, 3, ReverseMap.WHITE
    @change_color 4, 4, ReverseMap.BLACK
    return

  ReverseMap::put = (x, y, color, fire) ->
    if @check(x, y, color)
      @change_color x, y, color
      @turn()
    return

  ReverseMap::check = (x, y, color) ->
    @check_part(x - 1, y, color, [-1, 0]) > 1 or
    @check_part(x + 1, y, color, [1, 0]) > 1 or
    @check_part(x, y + 1, color, [0, 1]) > 1 or
    @check_part(x, y - 1, color, [0, -1]) > 1 or
    @check_part(x - 1, y - 1, color, [-1, -1]) > 1 or
    @check_part(x + 1, y + 1, color, [1, 1]) > 1 or
    @check_part(x - 1, y + 1, color, [-1, 1]) > 1 or
    @check_part(x + 1, y - 1, color, [1, -1]) > 1

  ReverseMap::check_part = (x, y, color, d) ->
    col = @get_color(x, y)
    if col == ReverseMap.BLOCK
      return 0
    else if col == ReverseMap.EMPTY
      return 0
    else
      if col == color
        return 1
      else
        c = @check_part(x + d[0], y + d[1], color, d)
        if c > 0
          @change_color x, y, color
          return c + 1
    0

  ReverseMap::change_color = (x, y, color) ->
    @map.put x, y, color
    @set_color x, y, color
    return

  ReverseMap::get_color = (x, y) ->
    if x >= 0 and y >= 0 and x < 8 and y < 8
      @data[x + y * 8]
    else
      ReverseMap.BLOCK

  ReverseMap::set_color = (x, y, color) ->
    if x >= 0 and y >= 0 and x < 8 and y < 8
      @data[x + y * 8] = color
      color
    else
      ReverseMap.BLOCK

  Map::init = ->
    i = 0
    j = 0
    while i < 8
        while j < 8
            @putEmpty i, j
            j++
        i++
        j = 0
    return

  Map::put = (x, y, color) ->
    shadow = s.circle(20, 20, 20)
    shadow.attr
      cx: 24
      cy: 28
      fill: "Gray"
      stroke: "#000"
      strokeWidth: 1
    shadow.transform "translate(" + x * 50 + "," + y * 50 + ")"
    elem = s.circle(20, 20, 20)
    elem.attr
      cx: 24
      cy: 25
      fill: if color == ReverseMap.WHITE then "#fff" else "#000"
      stroke: "#000"
      strokeWidth: 1
    elem.transform "translate(" + x * 50 + "," + y * 50 + ")"
    return

  Map::putEmpty = (x, y) ->
    self = this
    elem = s.rect(0, 0, 50, 50)
    elem.attr
      fill: "LimeGreen"
      stroke: "DarkGreen"
      strokeWidth: 3
    elem.transform "translate(" + x * 50 + "," + y * 50 + ")"
    elem.click ->
      self.click x, y
      return
    return

  return
