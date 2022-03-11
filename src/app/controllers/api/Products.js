const bcrypt = require("bcrypt");
const db = require("../../../config/database");
const Joi = require("../../schemas/joi");
const { requestResponse } = require("../../models/response");
const { query } = require("express");
const mongoose = require("mongoose");

function sortObjectByKeys(data) {
  if (typeof data !== "object") return data;

  if (Array.isArray(data)) {
    return data.map((obj, index) => {
      if (typeof obj !== "object") return obj;
      return Object.keys(obj)
        .sort()
        .reduce((r, k) => ((r[k] = obj[k]), r), {});
    });
  }
  return [
    Object.keys(data)
      .sort()
      .reduce((r, k) => ((r[k] = data[k]), r), {}),
  ];
}

module.exports = {

  async create(req, res) {
    try {
      const { error, value } = Joi.productCreate.validate(req.body);

      if (error) {
        return res
          .status(422)
          .json(
            requestResponse(
              null,
              false,
              "Unprocessable Entity",
              false,
              error.message
            )
          );
      }
      if (!error && value) {
        //return res.status(200).json();
        value.creadted_by = req.user.id;
        value.updated_by = req.user.id;

        let { category } = value;
        let categoryData = null;

        if (category && !db.isValidId(category)) {
          var filter = { name: category, creadted_by: req.user.id };
          var update = {
            $set: { name: category, updated_by: req.user.id },
            $setOnInsert: { creadted_by: req.user.id }
          };

          categoryData = await db.Category.findOneAndUpdate(filter, update, {
            new: true,
            upsert: true,
            rawResult: false, // Return the raw result from the MongoDB driver
          });
          value.category = categoryData.id;
        }


        if (category && db.isValidId(category)) {
          req.body.categoryId = mongoose.Types.ObjectId(category);
          value.category = req.body.categoryId;
        }


        let productInsertionData = await db.Product.create(value); //duplicated are permitted?

        var myMatch = { _id: mongoose.Types.ObjectId(productInsertionData.id) };
        let productData = await db.Product.aggregate([
          {
            $match: myMatch,
          },
          {
            $lookup: {
              from: "Categories",
              localField: "category",
              foreignField: "_id",
              as: "category_join",
            },
          },
          { $unwind: "$category_join" },
          {
            $project: {
              _id: 0,
              id: "$_id",
              title: "$title",
              description: "$description",
              price: "$price",
              category: {
                id: "$category_join._id",
                name: "$category_join.name",
              },
            },
          },
        ]);

        return res.json(requestResponse(productData, true, "Product created!"));
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  },

  async find(req, res) {
    try {
      var { title, category } = req.body;

      var myUserIdMatch = {};
      var myTitleMatch = {};
      var myCategoryMatch = {};
      var myOrParams = [];
      var myFilter = {};

      myUserIdMatch["creadted_by"] = mongoose.Types.ObjectId(req.user.id); //Mandatory | User can only access their own data

      if (title) {
        if (!Array.isArray(title)) title = new Array(title); //Multiple titles can be search
        myTitleMatch["title"] = { $in: title };
      }

      if (category) {
        if (!Array.isArray(category)) category = new Array(category); //Multiple categories can be search
        myCategoryMatch["category.name"] = { $in: category };
      }
      if (Object.keys(myTitleMatch).length > 0) myOrParams.push(myTitleMatch);
      if (Object.keys(myCategoryMatch).length > 0)
        myOrParams.push(myCategoryMatch);

      if (myOrParams.length > 0) {
        myFilter = { $or: myOrParams };
      }

      const productData = await db.Product.aggregate([
        {
          $match: myUserIdMatch,
        },
        {
          $lookup: {
            from: "Categories",
            localField: "category",
            foreignField: "_id",
            as: "category_join",
          },
        },
        { $unwind: "$category_join" },
        {
          $project: {
            _id: 0,
            id: "$_id",
            //_id_category: "$category_join._id",
            title: "$title",
            description: "$description",
            price: "$price",
            category: {
              id: "$category_join._id",
              name: "$category_join.name",
            },
          },
        },
        {
          $match: myFilter,
        },
      ]);

      return res.json(
        requestResponse(sortObjectByKeys(productData), true, "Success")
      );
    } catch (err) {
      return res
        .status(500)
        .json(requestResponse(null, false, "Internal Error", true));
    }
  },

  async get(req, res) {
    try {
      var { title, category } = req.params;

      var myUserIdMatch = {};
      var myTitleMatch = {};
      var myCategoryMatch = {};
      var myOrParams = [];
      var myFilter = {};

      myUserIdMatch["creadted_by"] = mongoose.Types.ObjectId(req.user.id); //Mandatory | User can only access their own data

      if (title) {
        myTitleMatch["title"] = title;
      }

      if (category) {
        myCategoryMatch["category.name"] = category;
      }
      if (Object.keys(myTitleMatch).length > 0) myOrParams.push(myTitleMatch);
      if (Object.keys(myCategoryMatch).length > 0)
        myOrParams.push(myCategoryMatch);

      if (myOrParams.length > 0) {
        myFilter = { $or: myOrParams };
      }

      const productData = await db.Product.aggregate([
        {
          $match: myUserIdMatch,
        },
        {
          $lookup: {
            from: "Categories",
            localField: "category",
            foreignField: "_id",
            as: "category_join",
          },
        },
        { $unwind: "$category_join" },
        {
          $project: {
            _id: 0,
            id: "$_id",
            //_id_category: "$category_join._id",
            title: "$title",
            description: "$description",
            price: "$price",
            category: {
              id: "$category_join._id",
              name: "$category_join.name",
            },
          },
        },
        {
          $match: myFilter,
        },
      ]);

      return res.json(
        requestResponse(sortObjectByKeys(productData), true, "Success")
      );
    } catch (err) {
      return res
        .status(500)
        .json(requestResponse(null, false, "Internal Error", true));
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;

      const myMatch = {};

      if (id) {
        if (db.isValidId(id)) {
          myMatch["_id"] = mongoose.Types.ObjectId(id);
          myMatch["creadted_by"] = mongoose.Types.ObjectId(req.user.id); //Mandatory | User can only access their own data
        } else {
          return res
            .status(422)
            .json(requestResponse(null, false, "Invalid id!", true));
        }
      }

      let productData = await db.Product.aggregate([
        {
          $match: myMatch,
        },
        {
          $lookup: {
            from: "Categories",
            localField: "category",
            foreignField: "_id",
            as: "category_join",
          },
        },
        { $unwind: "$category_join" },
        {
          $project: {
            _id: 0,
            id: "$_id",
            title: "$title",
            description: "$description",
            price: "$price",
            category: {
              id: "$category_join._id",
              name: "$category_join.name",
            },
          },
        },
      ]).catch((err) => {
        return res
          .status(500)
          .json(requestResponse(null, false, "Error", true, err.message));
      });

      return res
        .status(200)
        .json(requestResponse(sortObjectByKeys(productData), true, "Success"));
    } catch (err) {
      return res
        .status(500)
        .json(requestResponse(null, false, "Internal Error", true));
    }
  },

  async getByTitle(req, res) {
    try {
      const { title } = req.params;

      if (!title)
        return res
          .status(422)
          .json(requestResponse(null, false, "title param is required!", true));

      const myMatch = {};

      myMatch["creadted_by"] = mongoose.Types.ObjectId(req.user.id); //Mandatory | User can only access their own data
      myMatch["title"] = title;

      let productData = await db.Product.aggregate([
        {
          $match: myMatch,
        },
        {
          $lookup: {
            from: "Categories",
            localField: "category",
            foreignField: "_id",
            as: "category_join",
          },
        },
        { $unwind: "$category_join" },
        {
          $project: {
            _id: 0,
            id: "$_id",
            title: "$title",
            description: "$description",
            price: "$price",
            category: {
              id: "$category_join._id",
              name: "$category_join.name",
            },
          },
        },
      ]).catch((err) => {
        return res
          .status(500)
          .json(requestResponse(null, false, "Error", true, err.message));
      });

      return res
        .status(200)
        .json(requestResponse(sortObjectByKeys(productData), true, "Success"));
    } catch (err) {
      return res
        .status(500)
        .json(requestResponse(null, false, "Internal Error", true));
    }
  },

  async getByCategory(req, res) {
    try {
      const { category } = req.params;

      if (!category)
        return res
          .status(422)
          .json(
            requestResponse(null, false, "category param is required!", true)
          );

      const myMatch = {};
      const myFilter = {};

      myMatch["creadted_by"] = mongoose.Types.ObjectId(req.user.id); //Mandatory | User can only access their own data
      myFilter["category.name"] = category;

      let productData = await db.Product.aggregate([
        {
          $match: myMatch,
        },
        {
          $lookup: {
            from: "Categories",
            localField: "category",
            foreignField: "_id",
            as: "category_join",
          },
        },
        { $unwind: "$category_join" },
        {
          $project: {
            _id: 0,
            id: "$_id",
            title: "$title",
            description: "$description",
            price: "$price",
            category: {
              id: "$category_join._id",
              name: "$category_join.name",
            },
          },
        },
        {
          $match: myFilter,
        },
      ]).catch((err) => {
        return res
          .status(500)
          .json(requestResponse(null, false, "Error", true, err.message));
      });

      return res
        .status(200)
        .json(requestResponse(sortObjectByKeys(productData), true, "Success"));
    } catch (err) {
      return res
        .status(500)
        .json(requestResponse(null, false, "Internal Error", true));
    }
  },

  async edit(req, res) {
    var { id, title, description, price, category } = req.body;

    id ? null : (id = req.body.params?.id); //get id by params

    if (!id || !db.isValidId(id)) {
      return res
        .status(422)
        .json(requestResponse(null, false, "Invalid id!", true));
    }

    var myCondition = { id: id };
    var mySet = { updated_by: id };

    if (title) mySet["title"] = title;
    if (description) mySet["description"] = description;
    if (price) mySet["price"] = price;

    /* if category exists and its not id */
    if (category && !db.isValidId(category)) {
      /* create category if not exists */
      var filter = { name: category, creadted_by: req.user.id };
      var update = {
        $set: { name: category, updated_by: req.user.id },
        $setOnInsert: { creadted_by: req.user.id },
      };

      var categoryData = await db.Category.findOneAndUpdate(filter, update, {
        new: true,
        upsert: true,
        rawResult: false, // Return the raw result from the MongoDB driver
      });

      req.body.categoryId = categoryData.id;
      mySet["category"] = categoryData.id;
    }

       /* if category exists and its an valid id */
    if (category && db.isValidId(category)) {
      req.body.categoryId = mongoose.Types.ObjectId(req.body.category);
      mySet["category"] = req.body.categoryId;
    }

    try {
      let updateData = await db.Product.updateOne(myCondition, {
        $set: mySet,
      }).catch((err) => {
        return res
          .status(422)
          .json(
            requestResponse(null, false, "Update error", true, err.message)
          );
      });

      return res
        .status(200)
        .json(requestResponse(sortObjectByKeys(updateData), true, "Product edited"));
    } catch (err) {
      return res
        .status(500)
        .json(
          requestResponse(null, false, "Internal error", true, err.message)
        );
    }
  },

  async remove(req, res) {
    try {
      var { id } = req.body;

      id ? null : (id = req.params?.id);

      if (!id || !db.isValidId(id)) {
        return res
          .status(422)
          .json(requestResponse(null, false, "Invalid id!", true));
      }

      const deleteData = await db.Product.deleteOne({ id: req.params.id });

      return res.status(200).json(deleteData);
    } catch (err) {
      return res.status(500).json(deleteData);
    }
  },

  async removeAll(req, res) {
    try {
      var { id } = req.body;

      id ? null : (id = req.params?.id);

      if (!id || !db.isValidId(id)) {
        return res
          .status(422)
          .json(requestResponse(null, false, "Invalid id!", true));
      }

      const deleteData = await db.Product.deleteMany({});
      return res.status(200).json(requestResponse(deleteData, true));
    } catch (err) {
      return res
        .status(500)
        .json(requestResponse(null, false, "Internal Error", true));
    }
  },

};
