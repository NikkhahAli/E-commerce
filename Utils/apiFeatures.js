export class ApiFeatures {
    constructor(model, queryString) {
        this.model = model             // Tour.find()
        this.queryString = queryString    // req.query
    }

    filters() {
        const queryObj = { ...this.queryString }
        const fieldsItems = ['page', 'sort', 'limit', 'fields', 'populate']

        fieldsItems.forEach(pro => {
            delete queryObj[pro]
        })

        this.model = this.model.find(queryObj.filters)
        return this
    }
    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ')
            this.model = this.model.sort(sortBy)
        }
        else {
            this.model = this.model.sort('-createdAt') // اگه مرتب  سازی انتخاب نشد بر اساس زمانی که ساخته میشن مرتب کن 
        }
        return this
    }
    limit() {
        if (this.queryString.fields) {
            const fieldsBy = this.queryString.fields.split(',').join(' ')
            this.model = this.model.select(fieldsBy) // فقط میاد بر اساس اینا نشون میده رکورد هارو 
        }
        else {
            this.model = this.model.select('-__v')
        }
        return this
    }
    paginate() {
        const page = this.queryString.page * 1 || 1
        let limit = this.queryString.limit * 1 || 20 // تو هر صفحه چند تا رو نشون بده 
        let skip = (page - 1) * limit
        this.model = this.model.skip(skip).limit(limit)
        return this
    }
    populate() {
        if (this.queryString.populate) {
            if (typeof this.queryString.populate == 'string') {
                const populateBy = this.queryString.populate.split(',').join(' ')
                this.model = this.model.populate(populateBy)
            } else {
                this.model = this.model.populate(this.queryString.populate)
            }
        }
        return this
    }
    // secondPopulate (x) {
    //     this.model = this.model.populate(x)
    // }

}
// export default ApiFeatures