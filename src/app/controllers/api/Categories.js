const bcrypt = require('bcrypt');
const productModel = require('../../models/mongoose/Product');
const categoriesModel = require('../../models/mongoose/Category');
const Joi = require('../../schemas/joi')
const { requestResponse } = require('../../models/response');
const { query } = require('express');

module.exports = {

    async get(req, res) {
        try {
            let queryObj = {}
            if (req.decoded.user._id) queryObj.creadted_by = req.decoded.user._id
            if (req.params.title) queryObj.title = req.params.title
            if (req.params.category) queryObj.category = req.params.category
            const u = await productModel.findOne(queryObj)
            return res.json(u)
        } catch (error) {
            console.trace(error)
            return res.status(500).json(error)
        }
    },

    async create(req, res) {
        try {
            const { error, value } = Joi.categoryCreate.validate(req.body);

            if (error) {
                console.trace(error.message);
                return res.send(requestResponse(null, false, error.message));
            }
            if (value) {
                value.updated_by = '62256f668720b45b79fb659e'
                value.updated_by = '62256f668720b45b79fb659e'

                let { category } = value
                let categoryData = null;

                let c = await categoriesModel.create(value)//.then(data => data._doc);
                return res.json(c);
            }
        } catch (error) {
            console.trace(error)
            return res.status(500).json(error)
        }
    },

    async edit(req, res) {
        if (!req.body.senha)
            delete req.body.password
        else
            req.body.password = bcrypt.hash(req.body.password, 12)

        try {
            let u = await productModel.updateOne({ "_id": req.body._id }, { $set: req.body })
            return res.json(u)
        } catch (error) {
            console.trace(error)
            return res.status(500).json(error)
        }
    },

    async remove(req, res) {
        try {
            const u = await productModel.deleteOne({ "_id": req.params.id })
            return res.json(u)
        } catch (err) {
            console.error(err)
            return res.status(500).json(err)
        }
    },

    async getTitle(req, res) {
        try {
            let queryObj = {}
            if (req.decoded.user._id) queryObj.creadted_by = req.decoded.user._id
            if (req.params.title) queryObj.title = req.params.title
            const u = await productModel.findOne(queryObj)
            return res.json(u)
        } catch (error) {
            console.trace(error)
            return res.status(500).json(error)
        }
    },

    async getCategories(req, res) {
        try {
            let queryObj = {}
            if (req.decoded.user._id) queryObj.creadted_by = req.decoded.user._id
            if (req.params.category) queryObj.category = req.params.category
            const u = await productModel.findOne(queryObj)
            return res.json(u)
        } catch (error) {
            console.trace(error);
            return res.status(500).json(error);
        }
    },

    async getCategory(req, res) {
        try {
            var {name} = req.params
            let queryObj = {}
            if (req.decoded.user._id) queryObj.creadted_by = req.decoded.user._id
            if (req.params.category) queryObj.category = req.params.category
            const u = await productModel.findOne(queryObj)
            return res.json(u)
        } catch (error) {
            console.trace(error)
            return res.status(500).json(error)
        }
    },

    async findCategories(req, res) {
        
        try {
            const { error, value } = Joi.productCreate.validate(req.body);

            if (error) {
                console.trace(error.message);
                return res.send(requestResponse(error.message, false, true));
            }
            if (value) {
                var { id, name } = value;

                var filterObj = {};
                if (id) filterObj._id = id;
                if (name) filterObj.name = name;

                const dados = await productModel.find(filterObj)
                    .exec(function (err, data) {
                    })
                return res.json(dados);
            }
        } catch (error) {
            console.trace(error)
            return res.status(500).json(error)
        }
    },

}