declare global {

    declare enum FilterOption {
        $eq = "$eq",        // Equal
        $ne = "$ne",        // Not Equal
        $gt = "$gt",        // Greater Than
        $gte = "$gte",      // Greater Than or Equal
        $lt = "$lt",        // Less Than
        $lte = "$lte",      // Less Than or Equal
        $in = "$in",        // In
        $nin = "$nin",      // Not In
    
        $and = "$and",      // Logical AND
        $or = "$or",        // Logical OR
        $nor = "$nor",      // Logical NOR
        $not = "$not",      // Logical NOT
    
        $exists = "$exists",// Field Exists
        $type = "$type",    // Type Match
    
        $expr = "$expr",    // Expression Evaluation
        $mod = "$mod",      // Modulus
        $regex = "$regex",  // Regular Expression
        $text = "$text",    // Text Search
        $where = "$where",  // JavaScript Condition
    
        $all = "$all",      // Match All in Array
        $elemMatch = "$elemMatch", // Array Element Match
        $size = "$size",    // Array Size
    
        $addToSet = "$addToSet", // Add Unique Element to Array
        $pop = "$pop",      // Remove First or Last Element
        $pull = "$pull",    // Remove Elements by Condition
        $push = "$push"     // Add Elements to Array
    }
    
    interface MessageData {
        room: string,
        channel: string,
        data: any,
    }

}

export {};