<%@ Page Title="" Language="C#" MasterPageFile="~/Pages/Main.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="Khali.Default" %>
<asp:Content ID="Df_Head" ContentPlaceHolderID="Head" runat="server">
<base target="_blank" />
</asp:Content>
<asp:Content ID="Df_Body" ContentPlaceHolderID="Body" runat="server">
	<form id="KH" runat="server">
<div style="text-align: center;">
	<div style="padding-bottom: 20px;"><asp:TextBox ID="Url" class="sb-input" 
			runat="server" Width="70%" Height="32px" 
			ToolTip="Enter Website Address / URL here" Font-Italic="True" 
			Font-Names="Calibri,Consolas,Arial,Sans-Serif" Font-Size="14px"></asp:TextBox></div>
	<div><asp:Button ID="Go" class="sb-btn" runat="server" Text="Go" onclick="Go_Click" Width="30%" Height="32px" ToolTip="Browse anonymously" /></div>
</div>
<div id="Content" runat="server">
</div>
</form>
</asp:Content>
