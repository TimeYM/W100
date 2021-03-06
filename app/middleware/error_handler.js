var moment = require('moment');
module.exports = () => {
    return async function errorHandler(ctx, next) {
        try {
            await next();
        } catch (err) {
            // 所有的异常都在 app 上触发一个 error 事件，框架会记录一条错误日志
            ctx.app.emit('error', err, ctx);

            const status = err.status || 500;
            // 生产环境时 500 错误的详细错误内容不返回给客户端，因为可能包含敏感信息
            const error = status === 500 && ctx.app.config.env === 'prod'
                ? 'Internal Server Error'
                : err.message;

            // 从 error 对象上读出各个属性，设置到响应中
            ctx.body = { code: 1001, message: error };
            //参数错误记录http请求
            ctx.service.httpDefend.addHttp(ctx, 1001);
            if (status === 422) {
                ctx.body.detail = err.errors;
            }
            ctx.status = status;
            
            ctx.app.logger.error("",
              ctx.headers['x-forwarded-for'].split(',')[0],
              JSON.stringify(ctx.arg),
              JSON.stringify(ctx.body), "end",
              new Date().getTime() - ctx.arg._time);

            await ctx.model.MessageLogs.create({
                create_time: moment(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss'),
                message_type: "exception",
                uid: ctx.arg.uid,
                key: "",
                info: "参数:" + JSON.stringify(ctx.arg) +
                    ", 异常原因" + JSON.stringify(ctx.body),
                send_flag: false,
            });
        }
    };
};