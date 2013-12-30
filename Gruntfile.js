module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        uglify: {
            options: {
                sourceMap: 'js/lib/jstpl.js.map',
                beautify: {
                    //中文ascii化，非常有用！防止中文乱码的神配置
                    ascii_only: true
                }
                //banner : '/*{name : <%= pkg.name %>, author : <%= pkg.author %>, date : <%= grunt.template.today("yyyy-mm-dd") %>}*/'
            },
            build: {
                src: 'js/lib/jstpl-debug.js',
                dest: 'js/lib/jstpl.min.js'
            }
        },

        replace: {
            toDebug : {
                src: ['*.html'],
                overwrite: true,
                replacements: [{
                    from: /jstpl.min.js/g,
                    to: "jstpl-debug.js"
                }]
            },

            toRelease : {
                src: ['*.html'],
                overwrite: true,
                replacements: [{
                    from: /(jstpl-debug.js\?v=\d*)|(jstpl.min.js\?v=\d*)/g,
                    to: 'jstpl.min.js?v=<%= grunt.template.date("yyyymmddHHMMss")%>'
                }]
            },

            fixmap : {
              src: ['js/lib/jstpl.js.map'],
                overwrite: true,
                replacements: [{
                    from: '"file":"js/lib/jstpl.min.js"',
                    to: '"file":"jstpl.min.js"'
                },{
                    from: '"sources":["js/lib/jstpl-debug.js"]',
                    to: '"sources":["jstpl-debug.js"]'
                }]
            },

            fixMinJs : {
               src: ['js/lib/jstpl.min.js'],
                overwrite: true,
                replacements: [{
                    from: 'sourceMappingURL=js/lib/jstpl.js.map',
                    to: 'sourceMappingURL=jstpl.js.map'
                }]
            }
        }
    });

    grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.registerTask('default', ['uglify', 'replace:fixmap', 'replace:fixMinJs', 'replace:toRelease']);
};