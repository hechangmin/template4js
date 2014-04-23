module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        uglify: {
            options: {
                beautify: {
                    ascii_only: true
                }
            },
            build: {
                src: 'lib/template.debug.js',
                dest: 'lib/template.min.js'
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.registerTask('default', ['uglify']);
};