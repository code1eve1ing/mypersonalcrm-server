
const Joi = require('joi')
const Item = require('../models/Item')

const itemNewSchema = Joi.object({
    name: Joi.string().required(),
    buy: Joi.number().required(),
    sell: Joi.number().required(),
});

const itemUpdateSchema = Joi.object({
    _id: Joi.string().required(), // assumes MongoDB ObjectId as string
    name: Joi.string().required(),
    buy: Joi.number().required(),
    sell: Joi.number().required(),
});

const bulkPayloadSchema = Joi.object({
    new: Joi.array().items(itemNewSchema).optional(),
    update: Joi.array().items(itemUpdateSchema).optional(),
});

const bulkProcess = async (req, res) => {
    const { error, value } = bulkPayloadSchema.validate(req.body, {
        abortEarly: false,
    });

    if (error) {
        return res.status(400).json({
            error: 'Validation failed',
            details: error.details.map((e) => e.message),
        });
    }

    let { new: newItems, update: updateItems } = value;

    try {
        if (Array.isArray(newItems) && newItems.length > 0) {
            newItems = newItems.map(item => ({ ...item, user: req.user._id }))
            await Item.insertMany(newItems);
        }

        if (Array.isArray(updateItems) && updateItems.length > 0) {
            const bulkOps = updateItems.map((item) => ({
                updateOne: {
                    filter: { _id: item._id },
                    update: {
                        $set: {
                            name: item.name,
                            buy: item.buy,
                            sell: item.sell,
                        },
                    },
                },
            }));

            await Item.bulkWrite(bulkOps);
        }

        // Fetch all latest items
        const allItems = await Item.find().sort({ updatedAt: -1 });

        res.status(200).json(
            allItems
        );
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
}

const getAllItems = async (req, res) => {
    try {
        const allItems = await Item.find().sort({ updatedAt: -1 });
        res.status(200).json(
            allItems
        );
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
}


module.exports = { bulkProcess, getAllItems }