import { ZuploContext, ZuploRequest, environment } from "@zuplo/runtime";

const accountName = environment.ZP_ACCOUNT_NAME;
const bucketName = environment.ZP_API_KEY_SERVICE_BUCKET_NAME;

export default async function (request: ZuploRequest, context: ZuploContext) {
  const sub = request.user?.sub;
  
  const url = new URL(`https://dev.zuplo.com/v1/accounts/${accountName}/key-buckets/${bucketName}/consumers`);
  url.searchParams.set('limit', '1000');
  url.searchParams.set('offset', '0');

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${environment.ZP_DEVELOPER_API_KEY}`,
    },
  });

  if (!response.ok) {
    return new Response("Failed to retrieve API keys", { status: 500 });
  }

  const data = await response.json();
  
  const userConsumers = data.data?.filter((consumer: any) => 
    consumer.tags?.sub === sub
  );

  return { consumers: userConsumers || [] };
}