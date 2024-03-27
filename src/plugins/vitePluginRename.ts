import { deleteAsync } from 'del'
import gulp from 'gulp'
import gulpRename from 'gulp-rename'
import { PluginOption } from 'vite'

export function vitePluginRename(params: {
  list: {
    dest: string
    filename: string
    rename: string
  }[]
}): PluginOption {
  return {
    name: 'rename',
    closeBundle() {
      const oldPath: string[] = []
      params.list.forEach((item) => {
        const path = `${item.dest}/${item.filename}`
        oldPath.push(path)
        gulp.src(path).pipe(gulpRename(item.rename)).pipe(gulp.dest(item.dest))
      })
      deleteAsync(oldPath, {
        force: true
      })
    }
  }
}
