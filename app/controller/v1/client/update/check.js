'use strict';

const Controller = require('egg').Controller;
const _ = require("lodash");

class CheckController extends Controller {
    async checkVer() {
        const { ctx, service, app } = this;
        ctx.helper.pre("checkVer", {
          version: { type: 'string' },
          client: { type: 'string' },
        });
        let res = await ctx.model.WeexVersion.find({"client":ctx.query.client}).sort({ create_time: -1 }).limit(1);
        let json = res[0];
        json.remark = json.remark.replace(/\\n/g, '\n');
        if(ctx.query.version == json.version){
          json["update_status"] = '0';
        }
        ctx.body = {
          code: 0,
          message: 'OK',
          data: json
        };
        ctx.helper.end("checkVer");
    }

}

module.exports = CheckController;
