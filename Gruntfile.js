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
                src: 'lib/jstpl.debug.js',
                dest: 'lib/jstpl.min.js'
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.registerTask('default', ['uglify']);
};