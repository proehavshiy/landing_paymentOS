const { src, dest, series, watch } = require('gulp')

// пакеты
//const sass = require('gulp-sass') // компиляция scss в css
const sass = require('gulp-sass')(require('sass')); // компиляция scss в css
const csso = require('gulp-csso') // минификатор css
const fileInclude = require('gulp-file-include') // пакет, отвечающий за соединение данных файлов
const htmlmin = require('gulp-htmlmin') // минификатор html
const del = require('del') // чистит папки от старого билда в dist
const autoprefixer = require('gulp-autoprefixer') // добавляет автопрефиксы
const concat = require('gulp-concat') // соединяет файлы в один
const sync = require('browser-sync').create() // запускает сервер автоперезагрузки

function html() { // задача для gulp по сборке html. В консоли вызывется как gulp html
  return src('src/**.html') //говорим галпу, какие файлы обрабатывать
    .pipe(fileInclude({
      prefix: '@@'
    }))
    .pipe(htmlmin({
      collapseWhitespace: true,
    }))
    .pipe(dest('dist')) // куда поместить конечные обработанные файлы
}

function scss() { // задача по scss. gulp scss
  return src('src/scss/**.scss')
    .pipe(sass()) // компиляция scss в css
    // .pipe(autoprefixer({
    //   overrideBrowserslist: ['last 2 versions']
    // }))
    .pipe(autoprefixer()) // добавляем автопрефиксы к css (настройки указаны в package.json. лучше так делать)
    .pipe(csso()) // минифицируем css
    .pipe(concat('index.css')) // соединяем минифицированные css-файлы в 1 единственный
    .pipe(dest('dist'))
}

function clear() {
  return del('dist')
}

function serve() { // сервим сгенерированную итоговую статику
  sync.init({
    server: './dist' // инициализация сервера
  })

  watch('src/**.html', series(html)).on('change', sync.reload) // слушаем изменения и перезагружаем сервер
  watch('src/scss/**.scss', series(scss)).on('change', sync.reload)
}

exports.html = html // экспорт задачи 
exports.scss = scss // скомпилировать scss в css
exports.clear = clear // удалить(очистить) dist
exports.build = series(clear, html, scss) // gulp build - вызываем последовательно все через series
exports.serve = series(clear, html, scss, serve) // запустить лок сервер