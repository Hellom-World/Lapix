const { age, date, graduation } = require('../../lib/utils')
const db = require('../../config/db')
const Teacher = require ('../models/Teacher')

module.exports = {   
    index(req, res) {
        let {filter, page, limit } = req.query

        page = page || 1
        limit = limit || 2
        let offset = limit * (page - 1)

        const params = {
            filter,
            page,
            limit,
            offset,
            callback(teachers){

                const pagination = {
                    filter,
                    total: Math.ceil(teachers[0].total / limit),
                    page
                }
                return res.render("professores/index", { teachers, pagination, filter})
            }
        }

        Teacher.paginate(params)


    },
    create(req, res){
        return res.render('professores/create')        
    },   
    post(req, res){
    
        const keys = Object.keys(req.body)

        for(key of keys) {
            if (req.body[key] == ""){
                return res.send('Please, fill all fields!')
            }
        }

        Teacher.create(req.body, function(teachers) {
            return res.redirect(`/professores/${teachers.id}`)
        })
    },   
    show(req, res){
        Teacher.find(req.params.id, function(teacher){
            if (!teacher) return res.send("Instructor no found!")

            teacher.age = age(teacher.birth_date)
            teacher.subjects_taught = teacher.subjects_taught.split(",")
            teacher.created_at = date(teacher.created_at).format
            teacher.education_level = graduation(teacher.education_level)

            return res.render("professores/show.njk", { teacher })
        })    
    },                
    edit(req, res){
        Teacher.find(req.params.id, function (teacher){
            if (!teacher) return res.send("Instructor no found!")

            teacher.birth_date = date(teacher.birth_date).iso

            return res.render("professores/edit", { teacher })
        })
    },   
    put(req, res){
        
        const keys = Object.keys(req.body)

        for(key of keys) {
            if (req.body[key] == "") {
                return res.send("Please, fill all fields!")
            }
        }

        Teacher.update(req.body, function() {
            return res.redirect(`/professores/${req.body.id}`)
        })
    },   
    delete(req, res){
        Teacher.delete(req.body, function(){
            return res.redirect(`/professores`)
        })
    }   
}
