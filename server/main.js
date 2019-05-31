import { Meteor } from 'meteor/meteor';
import MongoClient from 'mongodb'

const dbName = 'hkexnew';
const collectionName = 'doi_records';
const uri = "mongodb+srv://hanjunyan_doi:jIV6c7F1lCA6S0Yh0@doi-v8ejd.mongodb.net/test?retryWrites=true";

Meteor.startup(() => {

});


Meteor.publish('query_name', function(selector){
    // this.changed('test', "_id");
    const self = this;
    const report_date = '28/05/2019';

    MongoClient.connect(uri, {useNewUrlParser: true}, function (err, client) {
        if (err) throw err;
        var db = client.db(dbName);
        db.collection("doi_records").find(selector).toArray(function (err, result) {
            if (err) throw err;
            for (i = 0; i < result.length; i++) {
                self.added('records', result[i]['serial_number'], result[i]);
                var after = parseFloat(result[i]['shares_percentage_after_event']);
                var before = parseFloat(result[i]['shares_percentage_before_event']);
                var changes_after_event = (after - before).toFixed(2);
                if (changes_after_event == 0 || isNaN(changes_after_event))
                    changes_after_event = '';
                else
                    changes_after_event = changes_after_event.toString() + '%';
                self.added('records', result[i]['serial_number'], {'changes_after_event': changes_after_event});
            }
            return result
        });
    });
    // }
    // else{
    //     MongoClient.connect(uri, {useNewUrlParser: true}, function (err, client) {
    //         if (err) throw err;
    //         var db = client.db(dbName);
    //         // var test = db.collection('doi_test').find({}).toArray(function(err,result){})
    //         db.collection("doi_test").find(selector).toArray(function (err, result) {
    //             if (err) throw err;
    //             for (i = 0; i < result.length; i++) {
    //                 self.added('records', result[i]['serial_number'], result[i]);
    //                 var after = parseFloat(result[i]['shares_percentage_after_event']);
    //                 var before = parseFloat(result[i]['shares_percentage_before_event']);
    //                 var changes_after_event = (after - before).toFixed(2);
    //                 if (changes_after_event == 0)
    //                     changes_after_event = '';
    //                 else
    //                     changes_after_event = changes_after_event.toString() + '%';
    //                 self.added('records', result[i]['serial_number'], {'changes_after_event': changes_after_event});
    //             }
    //             return result
    //         });
    //     });
    // }
});
