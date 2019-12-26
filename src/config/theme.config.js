const THEME_CONFIG = {
  // 静态背景
  static: {
    name: 'static',
    desc: '默认背景',
    descImg: './img/icon-bg.jpg',
  },
  // 星空飞行穿梭
  starsky: {
    name: 'starsky',
    desc: '星空飞行穿梭',
    descImg: './img/starsky.png',
    config: [{
        "name": "star_num",
        "desc": "星星个数",
        "dataType": "number",
        "min": 100,
        "max": 1000,
        "default": 500
      },
      {
        "name": "star_depth",
        "desc": "星星深度",
        "dataType": "number",
        "min": 100,
        "max": 500,
        "default": 250
      },
      {
        "name": "star_speed",
        "desc": "星星速度",
        "dataType": "number",
        "min": 20,
        "max": 100,
        "default": 50
      },
      {
        "name": "animatebg",
        "desc": "背景",
        "dataType": "color",
        "bgcolor": [{
            id: "animatebg1",
            bg: "#00010b"
          },
          {
            id: "animatebg2",
            bg: "#000b42"
          },
          {
            id: "animatebg3",
            bg: "#0d2080"
          },
        ],
        "default": "animatebg1"
      }
    ],
  },
  // 云朵
  clouds: {
    name: 'clouds',
    desc: '云朵',
    descImg: './img/clouds.png',
    config: [{
        "name": "cloud_speed",
        "desc": "漂移速度",
        "dataType": "number",
        "min": 1,
        "max": 10,
        "default": 5
      },
      {
        "name": "animatebg",
        "desc": "背景",
        "dataType": "color",
        "bgcolor": [{
            id: "animatebg1",
            bg: "linear-gradient(#051b44,#051b44),linear-gradient(#051b44,#051b44)"
          },
          {
            id: "animatebg2",
            bg: "linear-gradient(45deg, #051b44 0%,#4f3258 100%),linear-gradient(#00010b,#00010b)"
          },
          {
            id: "animatebg3",
            bg: "linear-gradient(90deg,#311956 0%,#1d4350 100%),linear-gradient(#00010b, #00010b)"
          },
          {
            id: "animatebg4",
            bg: "linear-gradient(90deg, #061161 0%, #6f0000 100%),linear-gradient(#00010b, #00010b)"
          },
        ],
        "default": "animatebg1"
      }
    ]
  },
  // 流行划过
  starflash: {
    name: 'starflash',
    desc: '流行划过',
    descImg: './img/starflash.png',
    config: [{
        "name": "flash_num",
        "desc": "星星个数",
        "dataType": "number",
        "min": 100,
        "max": 1000,
        "default": 600
      },
      {
        "name": "flash_speed",
        "desc": "闪烁速率",
        "dataType": "number",
        "min": 5,
        "max": 500,
        "default": 50
      },
      {
        "name": "animatebg",
        "desc": "背景",
        "dataType": "color",
        "bgcolor": [{
            id: "animatebg1",
            bg: "#00010b"
          },
          {
            id: "animatebg2",
            bg: "linear-gradient(#051b44,#051b44),linear-gradient(#051b44,#051b44)"
          },
          {
            id: "animatebg3",
            bg: "url(./img/firstbg.jpg)"
          },
          {
            id: "animatebg4",
            bg: "url(./img/firstbgb.jpg)"
          },
        ],
        "default": "animatebg1"
      }
    ]
  },
  // 编织星空
  starplait: {
    name: 'starplait',
    desc: '编织星空',
    descImg: './img/starplait.png',
    config: [{
        "name": "plait_num",
        "desc": "星星个数",
        "dataType": "number",
        "min": 20,
        "max": 200,
        "default": 100
      },
      {
        "name": "plait_speed",
        "desc": "漂移速度",
        "dataType": "number",
        "min": 10,
        "max": 250,
        "default": 50
      },
      {
        "name": "plait_radio",
        "desc": "线条粗细",
        "dataType": "number",
        "min": 1,
        "max": 10,
        "default": 5
      },
      //  {"name":"plait_alpha", "desc":"线条透明度","dataType":"alpha","min":1,"max":10,"default":5},
      {
        "name": "animatebg",
        "desc": "背景",
        "dataType": "color",
        "bgcolor": [{
            id: "animatebg1",
            bg: "url(./img/firstbgb.jpg)"
          },
          {
            id: "animatebg2",
            bg: "url(./img/firstbgc.jpg)"
          },
          {
            id: "animatebg3",
            bg: "#00010b"
          },
          {
            id: "animatebg4",
            bg: "linear-gradient(#051b44,#051b44),linear-gradient(#051b44,#051b44)"
          },
          {
            id: "animatebg5",
            bg: "linear-gradient(45deg, #051b44 0%,#4f3258 100%),linear-gradient(#00010b,#00010b))"
          },
        ],
        "default": "animatebg1"
      }
    ]
  }
}
const BG_OBJ = {};
Object.keys(THEME_CONFIG).forEach(item => {
   if (THEME_CONFIG[item]['config']) {
    BG_OBJ[item] = {};
    THEME_CONFIG[item]['config'].forEach(_item => {
      if (_item.name === 'animatebg') {
        _item.bgcolor.forEach(bg => {
          BG_OBJ[item][bg.id] = bg.bg;
        })
      }
    })
   }
})
export {
  THEME_CONFIG,
  BG_OBJ
};