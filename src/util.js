const moment = require('moment');
const Highcharts = require('highcharts');
import Papa from "papaparse";
import anchorme from 'anchorme'

import { companyId } from './api'

Highcharts.setOptions({
    global: {
        useUTC: false
    }
});

export const DOMAIN_LIST = [
  /* Default domains included */
  "aol.com", "att.net", "comcast.net", "facebook.com", "gmail.com", "gmx.com", "googlemail.com",
  "google.com", "hotmail.com", "hotmail.co.uk", "mac.com", "me.com", "mail.com", "msn.com",
  "live.com", "sbcglobal.net", "verizon.net", "yahoo.com", "yahoo.co.uk",

  /* Other global domains */
  "email.com", "fastmail.fm", "games.com" /* AOL */, "gmx.net", "hush.com", "hushmail.com", "icloud.com",
  "iname.com", "inbox.com", "lavabit.com", "love.com" /* AOL */, "outlook.com", "pobox.com", "protonmail.ch", "protonmail.com", "tutanota.de", "tutanota.com", "tutamail.com", "tuta.io",
 "keemail.me", "rocketmail.com" /* Yahoo */, "safe-mail.net", "wow.com" /* AOL */, "ygm.com" /* AOL */,
  "ymail.com" /* Yahoo */, "zoho.com", "yandex.com",

  /* United States ISP domains */
  "bellsouth.net", "charter.net", "cox.net", "earthlink.net", "juno.com",

  /* British ISP domains */
  "btinternet.com", "virginmedia.com", "blueyonder.co.uk", "freeserve.co.uk", "live.co.uk",
  "ntlworld.com", "o2.co.uk", "orange.net", "sky.com", "talktalk.co.uk", "tiscali.co.uk",
  "virgin.net", "wanadoo.co.uk", "bt.com",

  /* Domains used in Asia */
  "sina.com", "sina.cn", "qq.com", "naver.com", "hanmail.net", "daum.net", "nate.com", "yahoo.co.jp", "yahoo.co.kr", "yahoo.co.id", "yahoo.co.in", "yahoo.com.sg", "yahoo.com.ph", "163.com", "yeah.net", "126.com", "21cn.com", "aliyun.com", "foxmail.com",

  /* French ISP domains */
  "hotmail.fr", "live.fr", "laposte.net", "yahoo.fr", "wanadoo.fr", "orange.fr", "gmx.fr", "sfr.fr", "neuf.fr", "free.fr",

  /* German ISP domains */
  "gmx.de", "hotmail.de", "live.de", "online.de", "t-online.de" /* T-Mobile */, "web.de", "yahoo.de",

  /* Italian ISP domains */
  "libero.it", "virgilio.it", "hotmail.it", "aol.it", "tiscali.it", "alice.it", "live.it", "yahoo.it", "email.it", "tin.it", "poste.it", "teletu.it",

  /* Russian ISP domains */
  "mail.ru", "rambler.ru", "yandex.ru", "ya.ru", "list.ru",

  /* Belgian ISP domains */
  "hotmail.be", "live.be", "skynet.be", "voo.be", "tvcablenet.be", "telenet.be",

  /* Argentinian ISP domains */
  "hotmail.com.ar", "live.com.ar", "yahoo.com.ar", "fibertel.com.ar", "speedy.com.ar", "arnet.com.ar",

  /* Domains used in Mexico */
  "yahoo.com.mx", "live.com.mx", "hotmail.es", "hotmail.com.mx", "prodigy.net.mx",

  /* Domains used in Canada */
  "yahoo.ca", "hotmail.ca", "bell.net", "shaw.ca", "sympatico.ca", "rogers.com",

  /* Domains used in Brazil */
  "yahoo.com.br", "hotmail.com.br", "outlook.com.br", "uol.com.br", "bol.com.br", "terra.com.br", "ig.com.br", "itelefonica.com.br", "r7.com", "zipmail.com.br", "globo.com", "globomail.com", "oi.com.br"
]

// parse and highlight link in the text
export const highlightText = (text) => {
  return anchorme({
    input: text,
    // use some options
    options: {
      attributes: {
        target: "_blank",
        class: "detected"
      }
    },
    // and extensions
    extensions: [
    ]
  });
}

// mark colors based upon level

export const levelColor = (level) => {
  let color = 'green darken-1'
  level = level ? level.toLowerCase().trim() : 'low'
  switch (level) {
    case 'critical':
      color = 'black'
      break
    case 'high':
      color = 'red darken-4'
      break
    case 'medium':
      color = 'red lighten-1'
      break
    case 'low':
      color = 'green darken-1'
      break;
    case 'informational':
      color = 'grey lighten-1'
      break
  }
  return color
}

export const addKey = (items) => {
  return items.map((item, i) => ({
    ...item,
    _id: i
  }))
}

export const validEmail = (email) => {
  const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return pattern.test(email)
}

export const pieChart = (title, data, total) => {
  return {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: 'pie',
      height: '100%'
    },
    title: {
      text: title
    },
    subtitle: {
      text: `Total ${total}`
    },
    tooltip: {
      pointFormat: '<b>{point.y} ({point.percentage:.1f}%)</b>'
    },
    accessibility: {
      announceNewData: {
            enabled: true
      },
      point: {
          valueSuffix: '%'
      }
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: false,
          format: '{point.y:.1f} %',
          distance: '-20%',
        },
        showInLegend: true,
        center: ['50%', '50%']
      },
    },
    series:  [{
      name: '',
      colorByPoint: true,
      size: '90%',
      innerSize: '80%',
      data,
    }]
  }
}

// Risk Pie chart  template
const riskPieChart = ({critical, high, medium, low, informational, title, critical_label='Critical', high_label='High', medium_label='Medium', low_label="Low", informational_level="Informational"}) => {
  const data = [
  ]
  if (critical != undefined) {
    data.push({
      name: critical_label,
      y: parseFloat(critical),
      sliced: true,
      selected: true,
      color: 'black',
      drilldown: "Critical"
    })
  }
  if (high != undefined) {
    data.push({
      name: high_label,
      y: parseFloat(high),
      color: 'red',
      drilldown: "High"
    })
  }
  if (medium != undefined) {
    data.push({
      name: medium_label,
      y: parseFloat(medium),
      color: 'orange',
      drilldown: "Medium"
    })
  }
  if (low != undefined) {
    data.push({
      name: low_label,
      y: parseFloat(low),
      color: 'green',
      drilldown: "Low"
    })
  }
  if (informational != undefined) {
    data.push({
      name: informational_level,
      y: parseFloat(informational),
      color: 'gray',
      drilldown: "Informational"
    })
  }

  let total = high+medium+low
  if (critical) {
    total += critical
  }
  if (informational) {
    total += informational
  }

  return {
    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie',
        height: '100%'
    },
    title: {
      text: title
    },
    subtitle: {
      text: `Total ${total}`
    },
    tooltip: {
        pointFormat: '<b>{point.y} ({point.percentage:.1f}%)</b>'
    },
    accessibility: {
      announceNewData: {
            enabled: true
      },
      point: {
          valueSuffix: '%'
      }
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
            enabled: false,
            format: '{point.y:.1f} %',
            distance: '-20%',
        },
        showInLegend: true,
        center: ['50%', '50%']
      },
    },
    series: [{
      name: '',
      colorByPoint: true,
      size: '90%',
      innerSize: '80%',
      data
    }]
  }
}

// Bar Chart template
export const barchart = (title, subtitle='', yLabel, data, interval=1) => {
  return {
    chart: {
        type: 'column'
    },
    title: {
        text: title
    },
    subtitle: {
        text: subtitle
    },
    accessibility: {
      announceNewData: {
          enabled: true
      }
    },
    xAxis: {
      type: 'category'
    },
    yAxis: {
      min: 0,
      title: {
        text: yLabel
      },
      tickInterval: interval,
    },
    legend: {
      enabled: false,
    },
    tooltip: {
      headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
      pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b><br/>',
      shared: true,
      useHTML: true
    },

    plotOptions: {
      series: {
        borderWidth: 0,
        dataLabels: {
          enabled: true,
          format: '{point.y}'
        }
      }
    },
    series: [
      {
        name: "",
        colorByPoint: true,
        data
      }
    ]
  }
}

// column chart
export const columnChart = (title, subtitle, yLabel, series, categories, type='column') => {
  let pointFormat = '<b>{point.y} ({point.percentage:.1f}%)</b>'
  type = type.toLowerCase()
  if (type != 'pie') {
    pointFormat = '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
          '<td style="padding:0"><b>{point.y}</b></td></tr>'
  }
  if (type == 'bar') {
    type = 'column'
  }
  return {
    chart: {
      type,
      zoomType: 'x',
    },
    title: {
      text: title
    },
    subtitle: {
      text: subtitle
    },
    xAxis: {
      categories,
      crosshair: true
    },
    yAxis: {
      min: 0,
      title: {
        text: yLabel
      }
    },
    legend: {
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'top',
      x: -40,
      y: 80,
      floating: true,
      borderWidth: 1,
      backgroundColor:
          Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
      shadow: true
    },
    tooltip: {
      headerFormat: '<span style="font-size:14px">{point.key}:</span><table>',
      pointFormat,
      footerFormat: '</table>',
      shared: true,
      useHTML: true
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderRadius: 5,
        borderWidth: 0,
        dataLabels: {
          enabled: true,
          format: '{point.y}', // one decimal
        },
      },
      area: {
        pointStart: 1940,
        dataLabels: {
          enabled: true,
          format: '{point.y}', // one decimal
        },
        marker: {
          enabled: true,
          symbol: 'circle',
          radius: 2,
          states: {
            hover: {
              enabled: true
            }
          }
        }
      },
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '{point.percentage:.1f}%',
          distance: '-20%',
        },
        showInLegend: true,
        center: ['50%', '50%']
      },
    },
    series
  }
}

const lineChart = (title, subtitle, yLabel, categories, series) => {
  return {
    chart: {
        type: 'line',
        zoomType: 'x'
    },
    title: {
        text: title
    },
    subtitle: {
        text: subtitle
    },
    xAxis: {
        categories,
    },
    yAxis: {
      title: {
          text: yLabel
      }
    },
    legend: {
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'middle'
    },

    plotOptions: {
      series: {
        label: {
          connectorAllowed: false
        },
      }
    },
    condition: {
      maxWidth: 500
    },
    series,
    responsive: {
      rules: [{
        condition: {
          maxWidth: 500
        },
        chartOptions: {
          legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom'
          }
        }
      }]
    }
  }
}

export const riskLevelChart = (critical, high, medium, low, informational) => {
  return riskPieChart({critical, high, medium, low, informational, title:'Risk Levels'})
}

export const userRiskChart = (critical, high, medium, low, informational) => {
  return riskPieChart({critical, high, medium, low, informational, title:'Risk level by user'})
}

export const appRiskChart = (critical, high, medium, low, informational) => {
  return riskPieChart({critical, high, medium, low, informational, title:'Risk level by application'})
}

export const CIAChart = (high, medium, low) => {
  return riskPieChart({high, medium, low, title:'CIA', high_label:'Confidentiality', low_label:'Integrity', medium_label:'Availability'})
}

// donut chart template
export const scoreDonutChart = (score) => {
  let label = 'Critical Risk';
  let color = 'black';
  switch (score) {
    case 5:
      label = 'Critical Risk';
      color = 'black';
      break;
    case 4:
      label = 'High Risk'
      color = 'red';
      break;
    case 3:
      label = 'Medium Risk';
      color = 'orange';
      break;
    case 2:
    case 1:
      label = 'Low Risk';
      color = 'green';
      break;
    default:
      label = 'Low Risk';
      color = 'green';
      break;
  }
  return {
    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: 0,
        plotShadow: false,
        height: '100%'
    },
    title: {
      text: 'Org Score'
    },
    exporting: {
      enabled: false
    },
    credits: {
      enabled: false
    },
    tooltip: {
        pointFormat: '<b>{point.y}</b>'
    },
    plotOptions: {
        pie: {
            dataLabels: {
                enabled: true,
                distance: '-100%',
                y: -5,
                format: label,
                style: {
                    fontWeight: 'bold',
                    color: color,
                    fontSize: '14px'
                },
                filter: {
                    property: 'name',
                    operator: '===',
                    value: 'Score'
                },
            },
            borderWidth: 3
        },
        series: {
          animation: false
        }
    },
    series: [{
        type: 'pie',
        name: '',
        size: '70%',
        innerSize: '80%',
        data: [
            { name: 'Score', y: score, color: color },
            { name: '', y: 5-score, color: "#E6E6E6" },
        ]
    }]
  }
}

export const appUsersChart = (apps) => {
  let topApps = apps.sort((a, b) => b.no_users - a.no_users )
  let title= 'Users for Applications'
  let subtitle = `${apps.length} Applications`
  let yLabel = '# of Users'

  let data = []
  topApps.map(app => {
    if (Number(app.no_users) > 0) {
      data.push({
        name: app.application_name,
        y: app.no_users,
        drilldown: null
      })
    }
  })

  return barchart(title, subtitle, yLabel, data)
}

export const highriskCategoryChart = (categories) => {
  let title= 'Highest Risk by Category'
  let subtitle = `${categories.length} Categories`
  let yLabel = '# of Questions' 

  let topCategories = categories.sort((a, b) => b.cnt - a.cnt )
  let data = []
  topCategories.map(category => {
    if (Number(category.cnt) > 0) {
      data.push({
        name: category.category,
        y: category.cnt,
        drilldown: null
      })
    }
  })

  return barchart(title, subtitle, yLabel, data, 10)
}

export const ciaCategoryChart = (data, categories) => {
  let title = 'CIA by Category'
  let subtitle = `${categories.length} Categories`
  let yLabel = '#'

  return columnChart(title, subtitle, yLabel, data, categories)
}

export const highRiskByCatLineChart = (data) => {
  const title = ''
  let subtitle = ''
  let yLabel = '# of risks'

  const series = JSON.parse(JSON.stringify(data.series))
  const categories = JSON.parse(JSON.stringify(data.categories))
  return lineChart(title, subtitle, yLabel, categories, series)
}

export const get_json = (val) => {
  let res = {}
  try {
    res = JSON.parse(val.Answer)
  } catch(e) {}
  return res
}

export const parse_array = (val) => {
  let res = []
  try {
    res = JSON.parse(val.Answer)
  } catch(e) {}
  return res
}

export const beautifyEmail = (email) => {
  if (validEmail(email)) {
    return `<a href="mailto:${email}">${email}</a>`
  } else {
    return `${email}`
  }
}

export const beautifyEmails = (emails) => {
  if (!emails) {
    return
  }
  let res = ''
  let list = []
  if (emails.includes(';')) {
    list = emails.split(';')
  } else if (emails.includes('\n')) {
    list = emails.split('\n')
  } else if (emails.includes(',')) {
    list = emails.split(',')
  } else {
    list = [emails]
  }
  list.map(email => {
    try {
      if (validEmail(email.trim())) {
        res += `<a href="mailto:${email}">${email}</a><br />`
      } else {
        res += `${email} <br />`
      }
    } catch (e) {
      console.log(email)
    }
  })

  return res
}

export const beautifyDuration = (duration) => {
  return moment(duration, 'x').format('HH:mm:ss')
}
export const beautifyDateTimeFromUnix = (timestamp) => {
  return moment(timestamp, 'x').format('DD MMM YYYY, HH:mm:ss')
}

export const beautifyDateTime = (date) => {
  return moment(date).format('DD MMM YYYY, HH:mm:ss')
}

export const beautifyDate = (date) => {
  return moment(date).format('DD MMM YYYY')
}

export const formatDate = (date) => {
  if (!date) {
    return '02/03/2020'
  }
  return moment(date).format('MM/DD/YYYY')
}

export const beautifyDateZ = (date) => {
  return moment(date, 'YYYYMMDDHHmmss').format('MMM DD YYYY HH:mm:ss')
}

export const removeQuotes = (val) => {
  if (val) {
    return highlightText(val.replace(/\"/g, ""))
  } else {
    return ''
  }
}

export const readNewLine = (val) => {
  return val.replace(/\\n/g, '<br \\>')
}

export const getTableName = (val) => {
  const _val = val.toLowerCase().replace(' ', '_');
  var letters = /^[0-9a-zA-Z_]+$/;
  let name = ''
  for (var i = 0; i < _val.length; i++) {
    if (_val.charAt(i).match(letters)) {
      name += _val.charAt(i)
    }
  }

  return name
}

export const hexEncode = (str) =>  {
  var hex, i;

  var result = "";
  for (i=0; i < str.length; i++) {
      hex = str.charCodeAt(i).toString(16);
      result += (":"+hex).slice(-4);
  }

  return result.slice(1, result.length-2)
}

export const downloadCSV = (jsonData) => {
  const parseData = Papa.unparse(jsonData)
  var blob = new Blob([parseData], { type: 'text/csv;charset=utf-8;' });

  var link = document.createElement("a");

  var url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", 'filename.csv');
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}