  milkcocoa = new MilkCocoa("https://io-ni607qqxy.mlkcca.com:443")
  ds = milkcocoa.dataStore("othello").child("game1")
  map = new ReverseMap(ds)

  create_session = (cb) ->
    ts = (new Date).getTime()
    n = 2
    ds.child("session").on "set", (e) ->
      if e.id == "de"
        if ts != e.value.ts
          cb e.value.n
      else if e.id == "p1"
        if ts != e.value.ts
          ds.child("session").set "de",
            ts: ts
            n: n
          n++
          cb 1
      return
    ds.child("session").set "p1", ts: ts
    return

  create_session (index) ->
    if index == 1
      map.init ReverseMap.WHITE
    else if index == 2
      map.init ReverseMap.BLACK
    else
      alert "3人目です"
    return
  return
