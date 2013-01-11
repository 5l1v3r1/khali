using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Net;
using System.Configuration;
using Microsoft.Win32;
using HtmlAgilityPack;


namespace Khali.Pages
{
	public partial class Main : System.Web.UI.MasterPage
	{
		// Global Variables
		string WebsiteUrl, WebpageUrl, WebFile, WebExt, WebProto, WebsiteAddr, WebpageAddr, WebParams;
		string ResFile, ResPath, ResFullPath;
		WebHeaderCollection ReqHeaders, RespHeaders;

		// Functions
		protected string sbGetUrlInfo (string fetchUrl)
		{
			int Ptr;
			string Temp;

			// Get the Web Protocol
			if (!fetchUrl.Contains("://")) fetchUrl += "http://" + fetchUrl;
			Temp = fetchUrl;
			Ptr = Temp.IndexOf("://");
			Ptr = (Ptr >= 0) ? Ptr : Temp.Length;
			WebProto = Temp.Substring(0, Ptr);
			Temp = Temp.Substring(Ptr + 3);
			// Get Website Parameters
			Ptr = Temp.IndexOf('?');
			if (Ptr >= 0)
			{
				WebParams = Temp.Substring(Ptr + 1);
				Temp = Temp.Substring(0, Ptr);
			}
			else WebParams = "";
			// Get Website Address
			Ptr = Temp.IndexOf('/');
			Ptr = (Ptr >= 0) ? Ptr : Temp.Length;
			WebsiteAddr = Temp.Substring(0, Ptr);
			// Get Webpage Address
			Ptr = Temp.LastIndexOf('/');
			Ptr = (Ptr >= 0) ? Ptr : Temp.Length;
			WebpageAddr = Temp.Substring(0, Ptr);
			if (Ptr < Temp.Length) Temp = Temp.Substring(Ptr + 1);
			else Temp = "";
			// Get Webpage File
			WebFile = Temp;
			// Get WebPage Extension
			Ptr = Temp.LastIndexOf('.');
			if (Ptr >= 0) WebExt = Temp.Substring(Ptr);
			else WebExt = "";
			// Get Website URL
			WebsiteUrl = WebProto + "://" + WebsiteAddr;
			// Get Webpage URL
			WebpageUrl = WebProto + "://" + WebpageAddr;
			return fetchUrl;
		}
		protected string sbDwnldWebRes (string fetchUrl)
		{
			WebClient Clnt;

			ResPath = ConfigurationManager.AppSettings["Web_Resource_Path"];
			ResFile = Guid.NewGuid().ToString();
			ResFullPath = Server.MapPath(ResPath + ResFile);
			Clnt = new WebClient();
			/*
			Clnt.Headers = ReqHeaders;
			Clnt.Headers.Remove("Accept");
			Clnt.Headers.Remove("Connection");
			Clnt.Headers.Remove("Content-Length");
			Clnt.Headers.Remove("Expect");
			Clnt.Headers.Remove("If-Modified-Since");
			Clnt.Headers.Remove("Transfer-Encoding");
			*/
			Clnt.DownloadFile(fetchUrl, ResFullPath);
			RespHeaders = Clnt.ResponseHeaders;
			return ResFullPath;
		}
		protected object sbDwnldWebRes (string fetchUrl, bool dwnldToDsk)
		{
			WebClient Clnt;

			if (dwnldToDsk) return sbDwnldWebRes(fetchUrl);
			Clnt = new WebClient();
			Clnt.Headers = ReqHeaders;
			return Clnt.DownloadData(fetchUrl);
		}
		protected void sbSndWebRes (object dwnldedWebRes)
		{
			Response.Clear();
			/*
			for (int i=0 ; i < RespHeaders.Count ; i++)
			{
				Response.AddHeader(RespHeaders.GetKey(i), RespHeaders.Get(i));
			}
			*/
			if (dwnldedWebRes.GetType().Name == "String") Response.TransmitFile((string)dwnldedWebRes);
			else Response.BinaryWrite((byte[])dwnldedWebRes);
			Response.End();
		}
		protected string sbRcvWebResReq (string webResUrl)
		{
			string fetchUrl = Server.UrlDecode(webResUrl);
			ReqHeaders = new WebHeaderCollection();
			ReqHeaders.Add(Request.Headers);
			return sbGetUrlInfo(fetchUrl);
		}
		protected string sbEncdWebLnk (string webLnk)
		{
			int Ptr;
			string preLnk;

			if (!webLnk.Contains("://"))
			{
				Ptr = webLnk.IndexOf('/');
				if (Ptr < 0) Ptr = webLnk.Length;
				preLnk = webLnk.Substring(0, Ptr);
				if (!preLnk.Contains('.'))
				{
					if (Ptr == 0) webLnk = WebsiteUrl + "/" + webLnk.Substring(1);
					else webLnk = WebpageUrl + "/" + webLnk;
				}
			}
			preLnk = "/Default.aspx?wr=";
			string Lnk = preLnk +  Server.UrlEncode(webLnk);
			return Lnk;
		}
		protected void sbEncdHttpLnks (string fileName)
		{
			HtmlDocument Doc;
			HtmlNodeCollection Nodes;
			HtmlAttribute Attr;

			Doc = new HtmlDocument();
			Doc.Load(fileName);
			Nodes = Doc.DocumentNode.SelectNodes("//*[@href] | //*[@src]");
			foreach (HtmlNode Node in Nodes)
			{
				Attr = Node.Attributes["href"];
				if (Attr != null)
				{
					Node.SetAttributeValue("href", sbEncdWebLnk(Attr.Value));
				}
				Attr = Node.Attributes["src"];
				if (Attr != null)
				{
					Node.SetAttributeValue("src", sbEncdWebLnk(Attr.Value));
				}
			}
			Doc.Save(fileName);
		}
		protected void sbDoTransaction (string webResUrl)
		{
			string fetchUrl, resContent;

			fetchUrl = sbRcvWebResReq(webResUrl);
			sbDwnldWebRes(fetchUrl, true);
			resContent = RespHeaders["Content-Type"];
			if (resContent.Contains("html")) sbEncdHttpLnks(ResFullPath);
			sbSndWebRes(ResFullPath);
		}

		// Event handlers
		protected void Page_Load(object sender, EventArgs e)
		{
			string WebRes = Request["wr"];
			if (WebRes != null)
			{
				//try
				//{
					sbDoTransaction(WebRes);
				//}
				//catch (Exception ex)
				//{
				//	Msg.Text = ex.Message;
				//}
			}
		}
	}
}